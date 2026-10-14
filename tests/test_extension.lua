-- These tests run the real extension code with a small VLC API double.
-- They verify our behaviour, not the host's video decoders or a remote provider's promises.
local root = arg[1] or "."
local tmp = arg[2] or "/tmp"
local widgets, queued, played, deleted = {}, {}, {}, false

local function widget(text)
    local w = {text = text or "", values = {}, selection = {}, checked = false, value = 1}
    function w:set_text(v) self.text = v end
    function w:get_text() return self.text end
    function w:add_value(text, id) self.values[id] = text end
    function w:get_value() return self.value end
    function w:clear() self.values, self.selection = {}, {} end
    function w:get_selection() return self.selection end
    function w:get_checked() return self.checked end
    return w
end

vlc = {
    config = {configdir = function() return tmp end, userdatadir = function() return tmp end, homedir = function() return tmp end},
    playlist = {add = function(items) played[#played + 1] = items end, enqueue = function(items) queued[#queued + 1] = items end},
    deactivate = function() deactivate() end,
    dialog = function(title)
        local d = {}
        local function add(kind, text, col, row)
            local w = widget(text)
            widgets[kind .. ":" .. col .. ":" .. row] = w
            return w
        end
        function d:add_label(text, col, row) return add("label", text, col, row) end
        function d:add_html(text, col, row) return add("html", text, col, row) end
        function d:add_text_input(text, col, row) return add("input", text, col, row) end
        function d:add_button(text, callback, col, row) local w = add("button", text, col, row); w.callback = callback; return w end
        function d:add_dropdown(col, row) return add("dropdown", "", col, row) end
        function d:add_list(col, row) return add("list", "", col, row) end
        function d:add_check_box(text, state, col, row) local w = add("check", text, col, row); w.checked = state; return w end
        function d:add_image(...) return widget() end
        function d:del_widget(w) w.removed = true end
        function d:delete() deleted = true end
        return d
    end
}

-- The scan stage has no standard libraries. Catch accidental work at top level.
local scan = {}
local scanned = assert(loadfile(root .. "/iptv-channel-player.lua"))
if setfenv then
    setfenv(scanned, scan)
else
    scanned = assert(loadfile(root .. "/iptv-channel-player.lua", "t", scan))
end
scanned()
assert(scan.descriptor().icon:sub(1, 8) == "\137PNG\13\10\26\10")
local version_file = assert(io.open(root .. "/VERSION"))
assert(scan.descriptor().version == "v" .. version_file:read("*l"))
version_file:close()

dofile(root .. "/iptv-channel-player.lua")
local passed = 0
local function test(name, action)
    action()
    passed = passed + 1
    print("PASS " .. name)
end
local header = "id,name,group,country,language,stream_url,logo_url,tvg_id,enabled\n"
local data = header .. 'one,"News, World",News,GB,en,https://example.org/live?token=private,,,true\n' ..
    'two,Cartoons,Kids,GB,en,rtsp://example.org/cartoons,,,false\n'
local function write(path, text) local f = assert(io.open(path, "wb")); assert(f:write(text)); assert(f:close()) end
local csv = tmp .. "/native-fixture.csv"
write(csv, data)
os.remove(tmp .. "/iptv-channel-player-notice-seen.txt")

test("CSV BOM, CRLF and quoted commas", function()
    local rows = assert(IPTV.parse_csv("\239\187\191" .. data:gsub("\n", "\r\n")))
    assert(#rows == 2 and rows[1].name == "News, World")
end)
test("escaped quotes and trailing blank fields", function()
    local row = assert(IPTV.csv_line('a,"say ""hello""",'))
    assert(#row == 3 and row[2] == 'say "hello"' and row[3] == "")
end)
test("missing columns and malformed quotes rejected", function()
    assert(not IPTV.parse_csv("id,name\na,b\n"))
    assert(not IPTV.parse_csv(header .. 'one,"broken,News,GB,en,https://example.org,,,true\n'))
end)
test("duplicate IDs, invalid flags and control characters rejected", function()
    assert(not IPTV.parse_csv(data .. 'one,Other,News,GB,en,https://example.org,,,true\n'))
    assert(not IPTV.parse_csv(data:gsub(",false", ",maybe")))
    assert(not IPTV.parse_csv(data:gsub("Cartoons", "Cartoons\0")))
end)
test("M3U retains metadata and excludes disabled rows", function()
    local out, count = IPTV.m3u(assert(IPTV.parse_csv(data)))
    assert(count == 1 and out:find('group%-title="News"'))
    assert(out:find('token=private', 1, true) and not out:find('rtsp:', 1, true))
end)
test("plain-text search and group/disabled filters", function()
    local rows = assert(IPTV.parse_csv(data))
    assert(#IPTV.filter(rows, "NEWS,", nil, false) == 1)
    assert(#IPTV.filter(rows, ".*", nil, false) == 0)
    assert(#IPTV.filter(rows, "", "Kids", false) == 0)
    assert(#IPTV.filter(rows, "", "Kids", true) == 1)
end)
test("packaged examples parse and keep placeholder streams disabled", function()
    for _, name in ipairs({"blank-template.csv", "starter-categories.csv", "metadata-and-quoting.csv"}) do
        local file = assert(io.open(root .. "/examples/" .. name, "rb"))
        local examples = assert(IPTV.parse_csv(file:read("*a")))
        file:close()
        local _, count = IPTV.m3u(examples)
        assert(count == 0)
    end
end)
activate()
test("first launch shows the usage notice", function()
    assert(widgets["html:1:9"].text:find("Do not misuse", 1, true))
    show_help()
    assert(widgets["html:1:9"].removed)
end)
widgets["input:2:2"].text = csv
load_csv()
local list = widgets["list:1:4"]
test("load selects enabled rows without autoplay", function()
    assert(list.values[1] and not list.values[2] and #played == 0)
end)
test("selected channel plays within VLC", function()
    list.selection = {[1] = list.values[1]}
    play_selected()
    assert(#played == 1 and played[1][1].path == "https://example.org/live?token=private")
end)
test("queueing does not start playback or clear the playlist", function()
    queue_selected()
    queue_enabled()
    assert(#queued == 2 and #played == 1)
end)
test("disabled rows cannot play", function()
    widgets["check:5:3"].checked = true
    refresh_channels()
    list.selection = {[2] = list.values[2]}
    play_selected()
    assert(#played == 1)
end)
test("failed reload leaves the previous list usable", function()
    widgets["input:2:2"].text = tmp .. "/not-a-real-file.csv"
    load_csv()
    list.selection = {[1] = list.values[1]}
    play_selected()
    assert(#played == 2)
end)
test("export asks before replacing and keeps the original backup", function()
    local out = tmp .. "/native-output.m3u"
    write(out, "original")
    widgets["input:2:6"].text = out
    export_m3u()
    local f = assert(io.open(out)); assert(f:read("*a") == "original"); f:close()
    export_m3u()
    f = assert(io.open(out)); assert(f:read("*a"):find("#EXTM3U", 1, true)); f:close()
end)
test("failed final rename rolls back the original", function()
    local out = tmp .. "/native-rollback.m3u"
    write(out, "original")
    local rename = os.rename
    os.rename = function(a, b)
        if a:find(".tmp.", 1, true) then return nil, "forced failure" end
        return rename(a, b)
    end
    local ok = IPTV.write_m3u(out, "replacement", true)
    os.rename = rename
    assert(not ok)
    local f = assert(io.open(out)); assert(f:read("*a") == "original"); f:close()
end)
test("help notice and clean deactivation", function()
    show_help()
    assert(widgets["html:1:9"].text:find("Do not misuse", 1, true))
    show_help()
    assert(widgets["html:1:9"].removed)
    show_csv_guide()
    assert(widgets["html:1:9"].text:find("Never invent working", 1, true))
    close()
    assert(deleted)
end)
print(passed .. " native extension tests passed")
