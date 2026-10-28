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
    function w:clear() self.values, self.selection, self.value = {}, {}, 1 end
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
test("country and language filters are exact and composable", function()
    local rows = assert(IPTV.parse_csv(data ..
        'three,France News,News,FR,fr,https://example.org/france,,,true\n'))
    assert(#IPTV.filter(rows, "", nil, false, "all", false, "GB", nil) == 1)
    assert(#IPTV.filter(rows, "", nil, false, "all", false, nil, "fr") == 1)
    assert(#IPTV.filter(rows, "", "News", false, "all", false, "FR", "fr") == 1)
    assert(#IPTV.filter(rows, "", "News", false, "all", false, "GB", "fr") == 0)
end)
test("packaged examples parse and keep placeholder streams disabled", function()
    for _, name in ipairs({"blank-template.csv", "starter-categories.csv", "metadata-and-quoting.csv", "audience-categories.csv"}) do
        local file = assert(io.open(root .. "/examples/" .. name, "rb"))
        local examples = assert(IPTV.parse_csv(file:read("*a")))
        file:close()
        local _, count = IPTV.m3u(examples)
        assert(count == 0)
    end
end)
activate()
test("first launch shows the usage notice", function()
    assert(widgets["html:1:11"].text:find("Do not misuse", 1, true))
    show_help()
    assert(widgets["html:1:11"].removed)
end)
widgets["input:2:2"].text = csv
load_csv()
local list = widgets["list:1:6"]
test("load selects enabled rows without autoplay", function()
    assert(list.values[1] and not list.values[2] and #played == 0)
end)
test("native country and language controls narrow the visible list", function()
    write(csv, data .. 'three,France News,News,FR,fr,https://example.org/france,,,true\n')
    load_csv()
    local country, language = widgets["dropdown:2:4"], widgets["dropdown:4:4"]
    local country_id, language_id
    for id, value in pairs(country.values) do if value == "FR" then country_id = id end end
    for id, value in pairs(language.values) do if value == "fr" then language_id = id end end
    assert(country_id and language_id)
    country.value, language.value = country_id, language_id
    refresh_channels()
    assert(list.values[3] and not list.values[1] and not list.values[2])
    write(csv, data)
    load_csv()
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
    widgets["input:2:8"].text = out
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
test("export cannot replace the loaded source through a dot-segment alias", function()
    local source = tmp .. "/protected-source.m3u"
    write(source, data)
    widgets["input:2:2"].text = source
    load_csv()
    for _, alias in ipairs({tmp .. "/./protected-source.m3u", tmp .. "/../" .. tmp:match("([^/]+)$") .. "/protected-source.m3u"}) do
        widgets["input:2:8"].text = alias
        export_m3u()
        export_m3u()
        local file = assert(io.open(source, "rb"))
        assert(file:read("*a") == data, "Export replaced the loaded channel database through an alias")
        file:close()
    end
end)
test("path keys compare separators, dot segments and Windows drive casing", function()
    assert(IPTV.path_key("/tmp/child/../source.m3u", false) == "/tmp/source.m3u")
    assert(IPTV.path_key("C:\\Lists\\child\\..\\Source.m3u", true) == IPTV.path_key("c:/lists/source.m3u", true))
    assert(IPTV.path_key("/tmp/Source.m3u", false) ~= IPTV.path_key("/tmp/source.m3u", false))
    assert(IPTV.path_key("//server/share/./file.m3u", true) == "//server/share/file.m3u")
    vlc.strings = {make_uri = function(path)
        return path:sub(1, 1) == "/" and ("file://" .. path) or ("file:///fixture/" .. path)
    end}
    assert(IPTV.same_path("source.m3u", "/fixture/./source.m3u"))
    assert(not IPTV.same_path("source.m3u", "/fixture/other.m3u"))
    vlc.strings = nil
end)

local audience_header = header:gsub("\n$", ",audience\n")
local audience_data = audience_header
for i, label in ipairs({"cartoons", "12+", "16+", "18+", "xxx", "unrated"}) do
    audience_data = audience_data .. i .. ",Channel " .. i .. ",Films,GB,en,https://example.org/" .. i .. ",,,true," .. label .. "\n"
end
audience_data = audience_data .. "7,Disabled adult,Films,GB,en,https://example.org/7,,,false,xxx\n"
test("audience metadata is optional, normalised and validated", function()
    assert(IPTV.parse_csv(data)[1].audience == "")
    assert(IPTV.parse_csv(audience_data:gsub(",xxx", ", XXX "))[5].audience == "xxx")
    assert(not IPTV.parse_csv(audience_data:gsub(",xxx", ",unknown")))
    assert(not IPTV.parse_csv(audience_data:gsub(",xxx", ",all")))
    local reordered = "audience," .. header .. "18+,x,Test,Films,GB,en,https://example.org/x,,,true\n"
    assert(IPTV.parse_csv(reordered)[1].audience == "18+")
end)
test("legacy group labels work without guessing from channel names", function()
    for _, group in ipairs({"Adult", "XXX", " adult (xxx) "}) do
        assert(IPTV.audience({group=group}) == "xxx")
    end
    assert(IPTV.audience({group="Animation"}) == "cartoons")
    assert(IPTV.audience({group="Cartoons"}) == "cartoons")
    assert(IPTV.audience({group="18+"}) == "18+")
    assert(IPTV.audience({group="News", name="Adult cartoons"}) == "unrated")
    assert(IPTV.audience({group="Cartoons", audience="18+"}) == "18+")
    assert(IPTV.audience({group="Adult", audience="unrated"}) == "unrated")
end)
test("audience choices are exact categories and XXX needs explicit opt-in", function()
    local rows = assert(IPTV.parse_csv(audience_data))
    assert(#IPTV.filter(rows, "", nil, false) == 5)
    for _, label in ipairs({"cartoons", "12+", "16+", "18+", "unrated"}) do
        local result = IPTV.filter(rows, "", nil, false, label, false)
        assert(#result == 1 and rows[result[1]].audience == label)
    end
    assert(#IPTV.filter(rows, "", nil, true, "xxx", false) == 0)
    assert(#IPTV.filter(rows, "", nil, false, "xxx", true) == 1)
    assert(#IPTV.filter(rows, "", nil, true, "xxx", true) == 2)
    assert(#IPTV.filter(rows, "", nil, false, "all", true) == 6)
    assert(#IPTV.filter(rows, "Channel 5", "News", false, "all", true) == 0)
    assert(#IPTV.filter(rows, "Channel 5", "Films", false, "all", true) == 1)
end)
test("M3U helper hides XXX by default and always excludes disabled records", function()
    local rows = assert(IPTV.parse_csv(audience_data))
    local out, count = IPTV.m3u(rows)
    assert(count == 5 and not out:find("https://example.org/5", 1, true))
    out, count = IPTV.m3u(rows, "xxx", true)
    assert(count == 1 and out:find("https://example.org/5", 1, true))
    assert(not out:find("https://example.org/7", 1, true))
end)
test("native controls hide XXX initially and filter the list on apply", function()
    write(csv, audience_data)
    widgets["input:2:2"].text = csv
    load_csv()
    assert(not widgets["check:4:5"].checked and not list.values[5] and not list.values[7])
    for choice, row in ipairs({1, 2, 3, 4}) do
        widgets["dropdown:2:5"].value = choice + 1
        refresh_channels()
        local count = 0
        for _ in pairs(list.values) do count = count + 1 end
        assert(count == 1 and list.values[row])
    end
    widgets["dropdown:2:5"].value = 6
    refresh_channels()
    assert(next(list.values) == nil)
    widgets["check:4:5"].checked = true
    refresh_channels()
    assert(list.values[5] and list.values[7]) -- Show disabled is still enabled above.
end)
test("changing XXX visibility blocks stale selected playback and queueing", function()
    list.selection = {[5] = list.values[5]}
    local play_count, queue_count = #played, #queued
    play_selected()
    assert(#played == play_count + 1)
    widgets["check:4:5"].checked = false -- No Apply filter yet.
    play_selected()
    queue_selected()
    assert(#played == play_count + 1 and #queued == queue_count)
end)
test("bulk queue and export use current filters even before Apply filter", function()
    widgets["dropdown:2:5"].value = 1
    local queue_count = #queued
    queue_enabled()
    assert(#queued == queue_count + 1 and #queued[#queued] == 5)
    local out = tmp .. "/audience-export.m3u"
    widgets["input:2:8"].text = out
    export_m3u()
    local f = assert(io.open(out)); local text = f:read("*a"); f:close()
    assert(not text:find("https://example.org/5", 1, true))
    widgets["check:4:5"].checked = true
    widgets["input:2:3"].text = "Channel 5"
    queue_enabled()
    assert(#queued[#queued] == 1 and queued[#queued][1].path == "https://example.org/5")
    widgets["input:2:8"].text = tmp .. "/xxx-export.m3u"
    export_m3u()
    f = assert(io.open(widgets["input:2:8"].text)); text = f:read("*a"); f:close()
    assert(text:find("https://example.org/5", 1, true) and not text:find("https://example.org/1", 1, true))
    widgets["input:2:3"].text = ""
end)
test("invalid audience reload preserves the previous valid database", function()
    write(csv, audience_data:gsub(",xxx", ",typo"))
    load_csv()
    widgets["dropdown:2:5"].value = 6
    refresh_channels()
    assert(list.values[5])
    write(csv, audience_data)
end)
test("bulk operations include matches beyond the 1,000-row display cap", function()
    local many = audience_header
    for i = 1, 1002 do
        many = many .. i .. ",Many " .. i .. ",Films,GB,en,https://example.org/many/" .. i .. ",,,true,12+\n"
    end
    write(csv, many)
    widgets["dropdown:2:5"].value = 3
    load_csv()
    assert(list.values[1000] and not list.values[1001])
    queue_enabled()
    assert(#queued[#queued] == 1002)
    widgets["input:2:8"].text = tmp .. "/many-export.m3u"
    export_m3u()
    local f = assert(io.open(widgets["input:2:8"].text)); local text = f:read("*a"); f:close()
    local _, count = text:gsub("#EXTINF", "")
    assert(count == 1002)
    write(csv, audience_data)
end)
test("reopening resets XXX visibility and audience selection", function()
    deactivate()
    activate()
    list = widgets["list:1:6"]
    assert(widgets["dropdown:2:5"].value == 1 and not widgets["check:4:5"].checked)
    assert(list.values[1] and not list.values[5])
end)

test("help notice and clean deactivation", function()
    show_help()
    assert(widgets["html:1:11"].text:find("Do not misuse", 1, true))
    show_help()
    assert(widgets["html:1:11"].removed)
    show_csv_guide()
    assert(widgets["html:1:11"].text:find("Never invent working", 1, true))
    close()
    assert(deleted)
end)
print(passed .. " native extension tests passed")
