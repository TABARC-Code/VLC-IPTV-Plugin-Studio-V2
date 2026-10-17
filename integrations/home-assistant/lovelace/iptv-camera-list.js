/*
 * TABARC Camera List — optional Lovelace camera directory.
 */
(() => {
  'use strict';
  const TAG = 'tabarc-camera-list';
  const ENTITY = /^camera\.[a-z0-9_]+$/;
  const OFFLINE = new Set(['unavailable', 'unknown']);
  const DEFAULTS = Object.freeze({
    title: 'Cameras', show_search: true, show_unavailable: true,
    show_state: true, entities: null
  });

  function parseConfig(config) {
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      throw new Error('Camera List needs a card configuration.');
    }
    const settings = { ...DEFAULTS };
    if ('title' in config) {
      if (typeof config.title !== 'string') throw new Error('title must be text.');
      settings.title = config.title;
    }
    for (const flag of ['show_search', 'show_unavailable', 'show_state']) {
      if (flag in config) {
        if (typeof config[flag] !== 'boolean') throw new Error(flag + ' must be true or false.');
        settings[flag] = config[flag];
      }
    }
    if ('entities' in config) {
      if (!Array.isArray(config.entities) ||
          config.entities.some(value => typeof value !== 'string' || !ENTITY.test(value))) {
        throw new Error('entities must be a list of camera entity IDs.');
      }
      settings.entities = new Set(config.entities);
    }
    return settings;
  }

  class TabarcCameraList extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._config = { ...DEFAULTS };
      this._hass = null;
      this._query = '';
      this._grid = null;
      this._summary = null;
      this._search = null;
    }

    static getStubConfig() {
      return { title: 'Cameras', show_search: true, show_unavailable: true };
    }

    setConfig(config) {
      this._config = parseConfig(config);
      if (this._grid) {
        this._updateControls();
        this._renderList();
      }
    }

    set hass(hass) {
      this._hass = hass;
      if (this._grid) this._renderList();
    }

    getCardSize() {
      return Math.max(2, Math.min(8, 2 + Math.ceil(this._matchingCameras().length / 2)));
    }

    connectedCallback() {
      if (!this._grid) this._createCard();
      this._updateControls();
      this._renderList();
    }

    _matchingCameras() {
      const states = this._hass && this._hass.states ? Object.values(this._hass.states) : [];
      const query = this._query.trim().toLocaleLowerCase();
      return states
        .filter(item => item && typeof item.entity_id === 'string' && ENTITY.test(item.entity_id))
        .filter(item => !this._config.entities || this._config.entities.has(item.entity_id))
        .filter(item => this._config.show_unavailable || !OFFLINE.has(item.state))
        .map(item => ({
          entity_id: item.entity_id,
          name: typeof item.attributes?.friendly_name === 'string' && item.attributes.friendly_name.trim()
            ? item.attributes.friendly_name.trim() : item.entity_id,
          state: typeof item.state === 'string' ? item.state : 'unknown'
        }))
        .filter(item => !query || (item.name + ' ' + item.entity_id).toLocaleLowerCase().includes(query))
        .sort((a, b) => a.name.localeCompare(b.name) || a.entity_id.localeCompare(b.entity_id));
    }

    _createCard() {
      const style = document.createElement('style');
      style.textContent = [
        ':host { display:block; color:var(--primary-text-color); }',
        'ha-card { display:block; overflow:hidden; }',
        '.layout { padding:16px; }',
        '.heading { display:flex; flex-wrap:wrap; gap:12px; align-items:baseline; justify-content:space-between; margin-bottom:12px; }',
        'h2 { font-size:1.15rem; line-height:1.4; font-weight:600; margin:0; }',
        '.summary { color:var(--secondary-text-color); font-size:.85rem; }',
        '.search { box-sizing:border-box; width:100%; margin:0 0 12px; padding:10px 12px; border:1px solid var(--divider-color); border-radius:var(--ha-card-border-radius, 12px); background:var(--secondary-background-color, transparent); color:var(--primary-text-color); font:inherit; }',
        '.search:focus-visible, .entry:focus-visible { outline:2px solid var(--primary-color); outline-offset:2px; }',
        '.grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap:10px; }',
        '.entry { box-sizing:border-box; width:100%; text-align:left; cursor:pointer; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:14px; background:var(--secondary-background-color, transparent); border:1px solid var(--divider-color); border-radius:var(--ha-card-border-radius, 12px); color:var(--primary-text-color); font:inherit; }',
        '.entry:hover { border-color:var(--primary-color); }',
        '.details { display:flex; flex-direction:column; min-width:0; gap:4px; }',
        '.name { font-weight:600; overflow-wrap:anywhere; }',
        '.state { font-size:.82rem; color:var(--secondary-text-color); overflow-wrap:anywhere; }',
        '.state.offline { color:var(--error-color, var(--secondary-text-color)); }',
        '.entry ha-icon { flex-shrink:0; color:var(--state-icon-color, var(--secondary-text-color)); }',
        '.empty { margin:8px 0 0; color:var(--secondary-text-color); }',
        '@media (prefers-reduced-motion:no-preference) { .entry { transition:border-color .12s ease; } }'
      ].join('\n');
      const card = document.createElement('ha-card');
      const layout = document.createElement('div');
      layout.className = 'layout';
      const heading = document.createElement('div');
      heading.className = 'heading';
      this._heading = document.createElement('h2');
      this._summary = document.createElement('span');
      this._summary.className = 'summary';
      this._summary.setAttribute('role', 'status');
      heading.append(this._heading, this._summary);
      this._search = document.createElement('input');
      this._search.className = 'search';
      this._search.type = 'search';
      this._search.placeholder = 'Filter cameras';
      this._search.setAttribute('aria-label', 'Filter cameras');
      this._search.addEventListener('input', () => {
        this._query = this._search.value;
        this._renderList();
      });
      this._grid = document.createElement('div');
      this._grid.className = 'grid';
      layout.append(heading, this._search, this._grid);
      card.append(layout);
      this.shadowRoot.append(style, card);
    }

    _updateControls() {
      this._heading.textContent = this._config.title;
      this._search.hidden = !this._config.show_search;
      if (!this._config.show_search) {
        this._query = '';
        this._search.value = '';
      }
    }

    _renderList() {
      const cameras = this._matchingCameras();
      this._summary.textContent = cameras.length + (cameras.length === 1 ? ' camera' : ' cameras');
      this._grid.replaceChildren();
      if (!cameras.length) {
        const empty = document.createElement('p');
        empty.className = 'empty';
        empty.textContent = this._hass ? 'No cameras match this view.' : 'Waiting for Home Assistant cameras.';
        this._grid.append(empty);
        return;
      }
      for (const camera of cameras) {
        const entry = document.createElement('button');
        entry.type = 'button';
        entry.className = 'entry';
        entry.setAttribute('aria-label', 'Open ' + camera.name);
        const details = document.createElement('span');
        details.className = 'details';
        const name = document.createElement('span');
        name.className = 'name';
        name.textContent = camera.name;
        details.append(name);
        if (this._config.show_state) {
          const state = document.createElement('span');
          state.className = 'state' + (OFFLINE.has(camera.state) ? ' offline' : '');
          state.textContent = camera.state;
          details.append(state);
        }
        const icon = document.createElement('ha-icon');
        icon.setAttribute('icon', 'mdi:cctv');
        icon.setAttribute('aria-hidden', 'true');
        entry.append(details, icon);
        entry.addEventListener('click', () => {
          this.dispatchEvent(new CustomEvent('hass-more-info', {
            bubbles: true, composed: true, detail: { entityId: camera.entity_id }
          }));
        });
        this._grid.append(entry);
      }
    }
  }

  if (!customElements.get(TAG)) customElements.define(TAG, TabarcCameraList);
  window.customCards = window.customCards || [];
  if (!window.customCards.some(card => card.type === TAG)) {
    window.customCards.push({
      type: TAG, name: 'TABARC Camera List',
      description: 'Theme-aware Home Assistant camera directory.'
    });
  }
})();
