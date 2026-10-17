'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, '..', 'lovelace', 'iptv-camera-list.js'), 'utf8');

function setup() {
  class Element {
    constructor(tag = '') {
      this.tag = tag;
      this.children = [];
      this.attrs = {};
      this._events = {};
      this.textContent = '';
      this.value = '';
      this.hidden = false;
      this.isConnected = true;
      this.shadowRoot = null;
      this.className = '';
    }
    attachShadow() { this.shadowRoot = new Element('shadow'); return this.shadowRoot; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children = [...children]; }
    setAttribute(key, value) { this.attrs[key] = value; }
    addEventListener(event, handler) { this._events[event] = handler; }
    dispatchEvent(event) { this.lastEvent = event; return true; }
    click() { this._events.click?.(); }
  }
  const registry = new Map();
  const customElements = {
    define: (name, cls) => registry.set(name, cls),
    get: name => registry.get(name)
  };
  const window = {};
  const document = { createElement: name => new Element(name) };
  class CustomEvent {
    constructor(type, options) { this.type = type; Object.assign(this, options); }
  }
  vm.runInNewContext(source, { HTMLElement: Element, customElements, window, document, CustomEvent });
  return { Card: customElements.get('tabarc-camera-list'), window };
}

function camera(id, name, state = 'idle') {
  return { entity_id: id, attributes: { friendly_name: name }, state };
}

test('registers as an optional custom card', () => {
  const { Card, window } = setup();
  assert.equal(typeof Card, 'function');
  assert.equal(window.customCards[0].type, 'tabarc-camera-list');
});

test('lists camera entities, sorted by friendly name', () => {
  const { Card } = setup();
  const card = new Card();
  card.setConfig({ title: 'Cameras' });
  card.connectedCallback();
  card.hass = { states: {
    a: camera('sensor.temperature', 'Heat'),
    b: camera('camera.workshop', 'Workshop'),
    c: camera('camera.front', 'Front')
  } };
  assert.deepEqual(card._grid.children.map(entry => entry.children[0].children[0].textContent), ['Front', 'Workshop']);
  assert.equal(card._summary.textContent, '2 cameras');
});

test('opens Home Assistant camera details', () => {
  const { Card } = setup();
  const card = new Card();
  card.setConfig({});
  card.connectedCallback();
  card.hass = { states: { a: camera('camera.front', 'Front') } };
  card._grid.children[0].click();
  assert.equal(card.lastEvent.type, 'hass-more-info');
  assert.equal(card.lastEvent.detail.entityId, 'camera.front');
  assert.equal(card.lastEvent.bubbles, true);
  assert.equal(card.lastEvent.composed, true);
});

test('filters offline and allowlisted cameras', () => {
  const { Card } = setup();
  const card = new Card();
  card.setConfig({ entities: ['camera.workshop'], show_unavailable: false });
  card.connectedCallback();
  card.hass = { states: {
    a: camera('camera.workshop', 'Workshop', 'unavailable'),
    b: camera('camera.front', 'Front')
  } };
  assert.equal(card._grid.children[0].textContent, 'No cameras match this view.');
  card.hass = { states: { a: camera('camera.workshop', 'Workshop') } };
  assert.equal(card._grid.children.length, 1);
});

test('names stay text and the card uses theme variables', () => {
  const { Card } = setup();
  const card = new Card();
  card.setConfig({});
  card.connectedCallback();
  card.hass = { states: { a: camera('camera.front', '<script>bad()</script>') } };
  const name = card._grid.children[0].children[0].children[0];
  assert.equal(name.textContent, '<script>bad()</script>');
  assert.match(source, /--primary-text-color/);
  assert.match(source, /--secondary-text-color/);
  assert.match(source, /--primary-color/);
  assert.doesNotMatch(source, /innerHTML\s*=/);
});

test('rejects invalid entity IDs and switches', () => {
  const { Card } = setup();
  const card = new Card();
  assert.throws(() => card.setConfig({ entities: ['sensor.outside'] }), /camera entity/);
  assert.throws(() => card.setConfig({ show_search: 'false' }), /true or false/);
});
