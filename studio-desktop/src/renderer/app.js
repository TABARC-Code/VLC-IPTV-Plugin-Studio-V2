'use strict';

const state = {
  channels: [],
  library: '',
  search: '',
  categories: new Set(),
  countries: new Set(),
  showAdult: false,
  editingId: null,
  dirty: false
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const h = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function say(message, error = false) {
  const status = $('#status');
  status.textContent = message;
  status.classList.toggle('error', error);
}

function icon(name) {
  return `<i data-lucide="${name}" aria-hidden="true"></i>`;
}

function refreshIcons() {
  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
}

function unique(key) {
  return [...new Set(state.channels.map(channel => channel[key] || 'Unsorted'))].sort((a, b) => a.localeCompare(b));
}

function visibleChannels() {
  const query = state.search.toLocaleLowerCase();
  return state.channels.filter(channel => {
    if (channel.adult && !state.showAdult) return false;
    if (state.categories.size && !state.categories.has(channel.category || 'Unsorted')) return false;
    if (state.countries.size && !state.countries.has(channel.country || 'Unsorted')) return false;
    const haystack = [channel.name, channel.category, channel.country, channel.language].join(' ').toLocaleLowerCase();
    return !query || haystack.includes(query);
  });
}

function renderFilters(key, target, selected) {
  const counts = state.channels.reduce((all, channel) => {
    const value = channel[key] || 'Unsorted';
    all[value] = (all[value] || 0) + 1;
    return all;
  }, {});
  $(target).innerHTML = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)).map(([value, count]) => `
    <label class="filter-row"><input type="checkbox" data-filter="${key}" value="${h(value)}" ${selected.has(value) ? 'checked' : ''}><span>${h(value)}</span><span class="count">${count}</span></label>
  `).join('') || '<p class="hint">Nothing to filter yet.</p>';
}

function render() {
  const channels = visibleChannels();
  renderFilters('category', '#categories', state.categories);
  renderFilters('country', '#countries', state.countries);
  $('#category-options').innerHTML = unique('category').map(value => `<option value="${h(value)}"></option>`).join('');
  $('#library-name').textContent = state.library ? state.library.toUpperCase() : 'CHANNEL LIBRARY';
  $('#summary').textContent = `${channels.length} visible · ${state.channels.length} total${state.dirty ? ' · unsaved changes' : ''}`;
  $('#channel-rows').innerHTML = channels.length ? channels.map(channel => `
    <tr>
      <td><div class="channel-name">${channel.logo_url ? `<img class="channel-logo" src="${h(channel.logo_url)}" alt="" referrerpolicy="no-referrer">` : `<span class="channel-fallback">${icon('radio')}</span>`}<span>${h(channel.name)}</span></div></td>
      <td>${h(channel.category || 'Unsorted')}</td>
      <td>${h(channel.country || '—')}</td>
      <td>${h(channel.language || '—')}</td>
      <td><span class="pill ${channel.enabled ? 'live' : 'off'}">${channel.enabled ? 'Enabled' : 'Disabled'}</span>${channel.adult ? '<span class="pill adult">18+</span>' : ''}</td>
      <td><div class="row-actions"><button class="icon-button edit" data-id="${h(channel.id)}" aria-label="Edit ${h(channel.name)}">${icon('pencil')}</button><button class="icon-button remove" data-id="${h(channel.id)}" aria-label="Delete ${h(channel.name)}">${icon('trash-2')}</button></div></td>
    </tr>`).join('') : '<tr><td colspan="6" class="empty">No channels match this view.</td></tr>';
  refreshIcons();
}

async function refreshLibraries(selectName = state.library) {
  const names = await window.studio.listLibraries();
  $('#libraries').innerHTML = '<option value="">Choose a library</option>' + names.map(name => `<option value="${h(name)}" ${name === selectName ? 'selected' : ''}>${h(name)}</option>`).join('');
}

async function loadLibrary(name) {
  if (!name) return;
  const result = await window.studio.loadLibrary(name);
  state.library = result.name;
  state.channels = result.channels;
  state.dirty = false;
  state.categories.clear();
  state.countries.clear();
  render();
  say(`Loaded ${result.channels.length} channels from ${result.name}.`);
}

function formValue(id) { return $(id).value.trim(); }

function openEditor(channel = null) {
  state.editingId = channel?.id || null;
  $('#editor-title').textContent = channel ? 'Edit channel' : 'Add channel';
  $('#field-id').value = channel?.id || crypto.randomUUID().replaceAll('-', '').slice(0, 12);
  $('#field-name').value = channel?.name || '';
  $('#field-category').value = channel?.category || '';
  $('#field-country').value = channel?.country || '';
  $('#field-language').value = channel?.language || '';
  $('#field-url').value = channel?.stream_url || '';
  $('#field-logo').value = channel?.logo_url || '';
  $('#field-tvg').value = channel?.tvg_id || '';
  $('#field-notes').value = channel?.notes || '';
  $('#field-enabled').checked = channel?.enabled ?? true;
  $('#field-adult').checked = channel?.adult ?? false;
  $('#editor').showModal();
  $('#field-name').focus();
}

function commitEditor(event) {
  event.preventDefault();
  if (!$('#channel-form').reportValidity()) return;
  const channel = {
    id: formValue('#field-id'), name: formValue('#field-name'), category: formValue('#field-category'),
    country: formValue('#field-country'), language: formValue('#field-language'), stream_url: formValue('#field-url'),
    logo_url: formValue('#field-logo'), tvg_id: formValue('#field-tvg'), enabled: $('#field-enabled').checked,
    adult: $('#field-adult').checked, notes: formValue('#field-notes')
  };
  const index = state.channels.findIndex(item => item.id === state.editingId);
  if (index >= 0) state.channels[index] = channel; else state.channels.push(channel);
  state.dirty = true;
  $('#editor').close();
  render();
  say(`${channel.name} ${index >= 0 ? 'updated' : 'added'}. Save the library when ready.`);
}

async function guarded(action) {
  try { await action(); } catch (error) { say(error.message || String(error), true); }
}

$('#search').addEventListener('input', event => { state.search = event.target.value; render(); });
document.addEventListener('keydown', event => {
  if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) { event.preventDefault(); $('#search').focus(); }
});
document.addEventListener('change', event => {
  if (!event.target.matches('[data-filter]')) return;
  const set = event.target.dataset.filter === 'category' ? state.categories : state.countries;
  event.target.checked ? set.add(event.target.value) : set.delete(event.target.value);
  render();
});
$$('[data-clear]').forEach(button => button.addEventListener('click', () => {
  (button.dataset.clear === 'category' ? state.categories : state.countries).clear(); render();
}));
$('#show-adult').addEventListener('change', event => { state.showAdult = event.target.checked; render(); });
$('#add').addEventListener('click', () => openEditor());
$('#channel-form').addEventListener('submit', commitEditor);
$('#channel-rows').addEventListener('click', event => {
  const button = event.target.closest('button[data-id]');
  if (!button) return;
  const channel = state.channels.find(item => item.id === button.dataset.id);
  if (button.classList.contains('edit')) openEditor(channel);
  if (button.classList.contains('remove') && channel && confirm(`Delete “${channel.name}”?`)) {
    state.channels = state.channels.filter(item => item.id !== channel.id); state.dirty = true; render(); say(`${channel.name} removed. Save to make it permanent.`);
  }
});
$('#refresh').addEventListener('click', () => guarded(async () => { await refreshLibraries(); say('Library list refreshed.'); }));
$('#folder').addEventListener('click', () => guarded(() => window.studio.openLibraryFolder()));
$('#libraries').addEventListener('change', event => guarded(() => loadLibrary(event.target.value)));
$('#import').addEventListener('click', () => guarded(async () => {
  const result = await window.studio.chooseCsv();
  if (!result) return;
  state.library = result.name; state.channels = result.channels; state.dirty = false;
  await refreshLibraries(result.name); render(); say(`Imported ${result.channels.length} channels into ${result.name}.`);
}));
$('#save').addEventListener('click', () => guarded(async () => {
  const name = state.library || prompt('Library filename', 'channels.csv');
  if (!name) return;
  const result = await window.studio.saveLibrary({ name, channels: state.channels });
  state.library = result.name; state.dirty = false; await refreshLibraries(result.name); render(); say(`${result.name} saved.`);
}));
$('#export').addEventListener('click', () => guarded(async () => {
  const channels = visibleChannels();
  const result = await window.studio.exportPlaylist({ channels });
  if (result) say(`Exported ${channels.filter(channel => channel.enabled).length} enabled channels.`);
}));
$('#play').addEventListener('click', () => guarded(async () => {
  const channels = visibleChannels();
  if (!channels.some(channel => channel.enabled)) throw new Error('This view has no enabled channels to play.');
  let result = await window.studio.launchVlc({ channels });
  if (result.needsVlc) {
    const selected = await window.studio.chooseVlc();
    if (!selected) return;
    result = await window.studio.launchVlc({ channels });
  }
  if (result.launched) say('Playlist handed to VLC. Playback remains under VLC’s control.');
}));
$('#accept').addEventListener('click', () => { localStorage.setItem('usage-notice-v1', 'accepted'); $('#disclaimer').close(); });

guarded(async () => {
  const info = await window.studio.appInfo();
  $('#version').textContent = `v${info.version}`;
  await refreshLibraries();
  if (localStorage.getItem('usage-notice-v1') !== 'accepted') $('#disclaimer').showModal();
  render();
  say(info.vlcFound ? 'Ready. VLC found.' : 'Ready. VLC will be located when you first play a list.');
});

