-- IPTV Channel Player V2 | TABARC-Code | v1.4.10
-- VLC loads this file itself. No Python process, helper server or provider login is needed.
-- Keep the CSV outside the script: a channel change should not require a code edit.

local VERSION = "v1.4.10"
local BRAND = "TABARC-Code"
local ICON = "\137\080\078\071\013\010\026\010\000\000\000\013\073\072\068\082\000\000\000\064\000\000\000\064\008\002\000\000\000\037\011\230\137\000\000\013\212\073\068\065\084\120\156\205\090\123\144\092\101\149\063\231\124\247\213\221\243\078\050\147\153\076\038\201\012\198\130\013\088\004\101\018\030\226\090\011\171\086\177\155\248\064\022\044\216\020\017\045\004\065\065\075\035\091\128\181\107\080\150\021\145\135\084\201\195\085\116\119\149\146\130\045\118\137\164\148\144\205\198\071\082\129\128\049\072\146\201\076\030\051\153\204\179\123\186\111\223\123\191\239\236\031\183\111\247\189\183\111\247\244\064\044\247\171\169\153\238\219\223\227\119\158\223\239\156\030\180\218\091\161\177\129\008\204\000\192\000\216\224\146\026\027\001\240\025\155\073\013\111\230\163\135\119\132\222\095\218\232\129\013\205\164\119\170\206\196\081\107\203\198\161\055\012\138\106\127\212\216\105\152\244\186\113\160\117\015\111\068\138\058\002\212\117\192\068\172\243\226\198\224\167\177\081\111\191\096\147\176\000\213\243\107\031\021\155\091\031\086\088\090\062\019\246\009\001\008\011\240\014\130\161\026\022\134\094\156\017\196\053\070\035\089\232\109\157\207\085\047\254\052\131\170\014\073\116\164\051\101\248\051\063\098\049\080\141\210\127\178\144\208\251\147\142\042\020\213\089\008\235\190\253\115\143\042\013\199\130\248\255\025\220\006\224\104\111\003\052\017\098\089\240\192\197\148\100\078\008\147\100\226\132\008\036\016\152\001\177\060\139\021\040\021\092\096\220\104\250\210\022\004\029\017\000\033\159\243\160\168\226\027\053\009\221\160\042\025\146\209\059\014\203\156\027\255\192\196\116\147\206\156\168\136\154\099\001\002\032\130\146\092\180\213\123\047\110\027\188\164\045\149\022\138\001\129\089\129\097\209\207\127\060\250\214\129\057\035\069\192\064\148\108\085\165\024\017\028\091\189\235\236\166\141\215\044\045\218\202\103\184\072\080\152\147\187\119\076\237\221\053\109\101\052\036\096\110\212\008\141\010\128\008\172\152\008\238\125\244\156\143\093\219\115\124\184\144\207\075\068\004\096\165\056\149\022\059\126\049\121\112\127\142\008\157\162\114\231\188\096\153\143\000\001\001\128\245\180\048\077\242\092\094\210\101\124\232\111\058\231\114\138\008\024\088\041\104\106\018\095\184\115\224\095\191\055\114\239\150\055\133\065\193\146\006\128\053\088\015\016\065\126\198\219\114\223\234\235\110\092\126\235\166\215\095\126\241\180\012\101\093\102\016\026\146\000\215\086\109\139\245\181\131\173\136\192\204\037\224\037\249\097\239\175\103\166\039\092\221\018\074\178\148\190\100\165\033\008\062\180\161\235\190\199\206\126\240\222\035\223\253\250\161\076\135\046\101\035\240\027\179\000\033\020\109\213\179\042\245\137\235\150\221\117\251\031\094\252\143\227\169\014\075\068\141\139\008\210\229\214\118\253\225\031\157\187\162\063\101\023\164\097\082\144\217\216\041\170\084\138\014\191\153\191\233\218\253\115\115\082\008\068\196\216\242\103\127\048\188\180\215\218\124\203\242\031\063\126\108\102\218\211\245\234\136\170\224\014\052\087\087\128\160\004\003\064\144\142\234\091\105\001\203\223\237\154\022\025\131\008\164\012\249\040\002\018\056\005\121\214\096\235\121\107\091\110\189\254\141\003\251\179\133\130\044\151\048\169\180\056\231\061\077\015\060\126\110\255\187\051\123\118\077\167\155\005\007\203\017\001\024\136\128\082\250\174\095\078\222\252\229\021\043\007\210\123\118\205\024\006\036\011\016\160\071\006\174\075\167\067\235\017\000\000\005\178\082\136\160\084\144\040\066\132\135\021\152\105\113\224\181\236\043\047\077\061\240\228\154\077\055\247\157\030\177\179\179\110\118\214\061\125\172\248\233\207\247\061\240\196\154\151\095\058\253\230\235\057\051\037\056\148\195\074\012\149\065\049\248\251\106\026\084\050\108\002\172\210\143\127\120\178\000\085\107\017\016\067\105\161\106\107\004\102\032\129\197\130\250\220\039\247\189\178\125\162\187\199\068\002\093\039\093\039\036\088\186\204\250\213\139\019\183\092\253\154\227\040\162\168\106\195\180\015\001\124\041\176\081\018\155\044\064\237\076\140\028\057\051\002\130\025\116\139\092\091\158\026\115\000\128\021\248\073\221\215\247\232\137\130\107\203\200\093\145\124\202\194\010\231\122\116\186\162\103\230\138\179\215\029\204\128\136\186\142\113\023\099\054\012\066\196\006\110\169\192\057\026\019\161\094\081\207\225\162\164\193\180\204\000\012\174\199\062\215\040\039\115\034\116\093\005\060\095\075\038\228\220\243\015\004\008\185\080\210\042\046\207\244\037\136\231\190\164\021\204\132\203\087\090\211\147\046\048\032\001\018\128\130\201\137\226\242\085\105\038\226\112\185\254\182\137\047\086\018\032\053\226\027\254\169\092\047\054\000\000\132\128\252\140\183\254\242\142\247\093\212\246\179\031\157\032\139\028\091\057\069\069\022\062\243\244\216\186\075\219\007\063\216\158\159\241\132\168\077\019\176\156\064\176\242\164\122\086\104\097\189\052\154\040\075\045\027\032\130\148\096\152\180\101\235\187\094\120\102\108\207\203\211\036\176\127\117\102\069\127\138\052\252\205\047\039\183\061\055\254\181\173\171\117\131\164\172\157\099\056\158\187\235\122\070\073\000\172\241\081\104\018\034\074\238\234\054\165\132\217\025\041\004\086\231\082\018\104\079\185\087\111\238\093\182\220\186\255\158\067\122\070\040\143\191\186\245\172\219\239\026\240\138\172\167\233\159\239\062\180\162\063\125\213\166\030\123\218\037\017\087\003\003\008\013\039\038\028\207\083\093\221\022\074\166\144\170\018\148\086\238\074\096\228\089\050\251\245\092\197\012\159\184\174\103\255\222\220\248\113\219\048\137\163\126\071\004\078\065\118\174\076\125\254\171\253\015\125\107\104\244\168\237\022\229\149\127\215\125\193\133\173\235\223\223\126\249\134\197\174\003\199\015\023\030\189\255\232\109\095\027\088\188\204\114\108\089\174\040\074\138\086\096\154\116\114\200\126\109\079\246\170\191\239\097\201\210\171\088\187\068\008\147\140\079\033\157\039\163\087\138\029\155\191\114\223\234\011\047\110\123\232\222\195\072\065\009\018\246\069\068\055\039\111\187\179\127\124\212\126\250\177\099\122\070\116\116\154\159\185\109\185\093\080\158\199\159\187\163\191\165\077\024\077\226\169\071\134\103\166\188\091\182\172\114\179\094\089\193\021\000\008\136\240\157\111\028\185\248\003\139\110\223\186\186\144\245\148\172\200\128\028\141\192\070\026\091\126\001\096\153\244\200\191\159\247\241\107\187\111\219\244\250\222\221\211\086\147\080\170\052\221\095\032\004\020\102\189\243\047\107\223\120\205\210\127\218\242\150\083\084\110\081\093\176\174\181\111\085\170\104\075\187\160\250\087\167\207\031\108\115\139\108\023\228\214\059\223\186\234\250\158\053\235\219\010\089\143\068\228\056\037\193\106\214\246\254\239\212\023\111\120\227\218\027\122\191\251\147\115\077\147\202\050\196\193\133\026\091\245\122\042\082\114\042\163\093\116\089\251\240\080\225\149\095\076\232\070\060\232\017\065\041\032\130\047\221\115\214\075\207\143\239\252\175\241\076\171\134\008\147\019\046\032\232\006\025\006\002\194\244\164\003\192\077\173\218\246\231\198\094\217\062\113\199\093\003\145\030\072\133\093\178\102\208\175\094\028\063\062\082\184\244\175\022\089\105\146\106\158\091\161\094\081\207\012\186\065\083\019\206\141\031\127\181\163\195\248\225\011\107\083\041\010\187\166\047\128\109\171\085\103\103\222\125\078\250\137\135\071\080\039\086\156\202\136\125\187\103\030\251\151\017\197\224\121\240\232\125\067\251\127\055\107\101\004\043\064\194\039\031\062\182\230\252\230\222\001\171\104\043\010\245\165\016\193\115\185\185\089\251\201\182\011\076\011\111\252\232\171\051\083\117\073\053\000\132\043\178\010\121\142\202\064\002\119\191\052\241\169\043\247\062\255\063\239\187\225\214\190\111\255\195\161\204\162\072\181\193\138\117\157\128\113\046\231\177\098\159\047\024\041\122\232\155\135\159\251\233\040\043\024\057\146\183\210\002\131\178\046\059\235\001\128\097\008\021\213\046\017\020\114\242\142\123\006\022\119\026\087\174\255\245\216\081\059\213\161\115\188\246\078\176\064\016\076\053\004\101\134\150\165\198\177\131\185\167\030\025\249\219\079\118\167\218\052\207\013\229\007\006\043\037\014\031\156\027\059\233\220\244\165\149\154\192\220\140\155\207\122\133\156\199\012\071\223\200\013\031\200\049\064\033\231\229\179\050\055\227\105\058\126\230\139\125\199\071\236\163\135\242\166\069\101\124\136\224\186\220\188\088\255\240\134\206\239\063\056\060\054\084\104\233\050\231\069\015\013\214\196\210\003\212\105\223\111\179\215\127\182\183\179\219\028\025\178\045\013\057\096\160\036\192\046\168\187\111\063\248\200\211\107\182\189\182\126\244\152\035\132\095\073\150\228\244\131\158\016\165\228\238\229\102\058\067\055\093\179\095\186\172\155\164\162\002\244\173\052\091\090\244\055\246\101\209\032\207\011\195\175\073\162\180\234\207\042\183\100\232\190\100\068\199\081\000\160\105\113\070\201\010\082\077\218\111\118\078\125\244\047\247\124\100\099\231\162\037\166\098\070\000\036\191\048\046\241\016\068\068\196\157\219\039\255\243\153\177\225\161\124\186\156\205\042\027\177\166\017\038\183\152\106\050\157\132\198\022\087\189\226\114\218\143\134\175\095\054\185\046\043\169\172\180\024\062\146\255\222\055\014\085\165\181\104\178\004\016\025\145\206\104\145\000\136\110\027\225\058\243\141\133\052\182\162\219\074\169\132\032\207\229\165\061\230\221\247\175\238\093\097\049\163\208\208\175\098\016\177\104\171\251\191\126\104\215\246\073\051\163\041\089\097\182\074\114\044\124\149\084\164\137\072\137\189\016\001\230\227\232\033\248\037\162\136\232\121\106\229\138\238\129\254\238\003\007\198\222\179\206\189\240\146\142\239\252\227\033\197\044\004\033\001\033\020\231\228\213\155\151\125\120\227\146\125\187\188\193\193\001\219\118\137\016\003\221\098\032\012\051\008\065\195\195\163\067\035\163\136\000\128\129\207\045\064\128\122\232\003\157\148\174\136\208\206\220\222\222\210\222\214\108\026\147\128\238\216\201\194\227\223\030\002\009\000\010\192\239\055\056\003\127\209\108\154\172\025\122\075\115\038\147\102\068\148\082\002\160\105\232\082\073\207\147\254\201\154\016\217\246\230\161\225\147\165\186\169\226\066\013\149\197\243\184\080\178\069\253\220\034\165\039\021\051\051\179\174\083\107\167\089\152\245\086\159\215\182\241\154\046\207\101\215\086\023\094\212\188\123\231\036\002\043\086\007\255\056\146\078\091\203\186\151\040\165\246\255\254\112\107\075\166\171\179\221\117\060\036\068\192\178\071\049\248\157\209\249\202\226\144\175\197\093\168\134\212\073\117\056\034\066\169\072\067\064\096\150\030\119\044\214\007\047\105\043\228\149\242\120\209\018\083\074\070\004\065\052\049\057\235\056\110\111\207\018\207\243\078\157\154\036\194\165\093\029\136\152\112\249\212\239\071\196\190\045\170\110\108\213\040\051\074\247\092\165\096\002\020\068\066\016\009\098\000\041\213\236\140\100\201\059\158\031\223\241\252\024\000\001\056\223\124\114\109\166\073\099\064\000\028\124\239\217\068\164\152\053\077\187\104\221\026\068\244\164\020\154\080\138\137\136\074\140\002\162\037\107\146\036\085\015\234\196\000\135\130\013\253\138\152\153\164\242\101\224\169\233\217\217\217\102\059\111\107\026\053\053\107\235\046\107\083\018\124\130\073\136\133\025\183\183\207\058\113\098\206\115\189\220\092\222\046\184\254\061\000\000\082\041\223\116\126\251\167\072\052\053\157\005\000\036\080\010\088\097\163\125\221\064\128\068\232\209\247\204\040\240\244\184\099\152\162\183\047\117\100\127\054\211\101\014\031\027\061\057\058\110\231\101\230\247\077\217\089\239\193\167\214\004\221\052\006\064\197\032\004\252\252\223\078\204\076\077\239\216\249\170\148\028\221\031\137\128\004\050\003\048\075\197\086\074\155\029\117\186\123\077\161\195\233\113\007\181\112\031\173\106\132\158\199\186\211\053\083\042\034\056\005\249\196\179\107\187\151\025\159\250\200\158\083\195\054\248\109\124\004\096\213\220\105\045\238\052\188\016\081\069\004\215\085\167\070\029\077\139\051\112\102\070\066\059\047\193\014\017\009\086\157\125\169\031\190\176\246\196\049\123\243\134\125\070\090\148\020\153\088\248\135\100\091\064\123\221\177\085\119\175\249\253\159\173\237\088\162\255\247\179\163\185\172\071\132\082\170\116\134\182\061\055\177\107\219\132\022\101\007\136\096\024\228\155\197\079\045\200\192\008\068\232\204\201\075\175\088\244\129\043\058\242\115\146\008\020\115\083\179\254\215\027\058\103\038\189\205\031\219\119\252\168\109\164\040\078\052\202\224\163\102\169\153\070\099\214\083\010\012\139\142\143\020\175\190\226\183\155\110\238\187\228\131\029\186\033\152\089\041\110\105\021\127\120\061\191\091\035\203\018\082\177\175\030\004\224\114\017\024\252\246\021\071\008\210\085\125\171\210\239\191\188\115\122\202\021\002\000\064\122\234\167\063\056\249\228\067\195\147\167\029\043\237\051\109\140\064\193\080\123\167\182\011\065\036\118\171\042\004\191\193\230\102\061\048\073\008\044\231\108\161\249\036\162\150\054\042\090\241\005\003\004\233\149\202\118\223\068\082\050\020\149\222\164\233\006\038\234\062\097\019\255\117\029\023\170\182\151\047\021\017\006\029\246\170\152\105\224\246\076\170\156\024\017\067\219\046\096\212\253\126\000\146\018\049\131\172\208\221\224\242\175\130\088\111\091\014\077\043\165\076\140\110\187\128\177\208\206\092\124\036\168\051\169\052\077\028\126\207\187\001\191\043\153\057\081\045\053\190\224\008\192\085\063\076\154\055\223\180\164\085\101\088\243\142\178\035\036\138\090\227\011\142\200\031\072\122\023\073\018\097\040\012\243\033\227\032\082\194\190\084\075\065\117\182\066\128\183\233\066\161\187\190\194\172\048\042\082\213\073\225\017\211\133\159\151\184\108\207\132\221\107\142\249\130\056\012\058\180\047\099\100\222\060\037\069\117\088\087\199\125\140\239\198\138\204\218\248\026\182\064\080\215\064\080\218\148\088\079\249\170\226\138\238\226\081\029\220\104\126\218\009\027\176\188\134\001\176\252\197\100\212\181\234\167\132\121\004\008\075\207\080\082\188\239\229\204\021\040\225\035\194\069\121\172\173\089\041\085\056\016\038\092\227\197\250\009\245\179\089\000\076\139\061\228\164\073\229\048\141\028\224\255\013\221\139\028\090\231\127\043\155\208\234\043\239\086\150\033\028\247\049\255\169\115\045\006\207\035\255\087\082\094\142\229\247\092\066\025\195\023\073\059\085\229\026\199\236\018\120\078\057\027\114\088\223\213\213\094\152\065\205\023\012\148\040\097\229\097\000\165\066\203\018\041\079\232\066\040\059\073\245\118\126\181\024\142\215\122\105\166\202\059\125\242\030\075\000\009\049\016\227\055\088\253\065\153\139\135\230\148\074\089\014\253\171\079\018\030\192\200\054\137\197\118\120\073\076\235\254\237\017\126\072\225\217\241\245\033\207\193\080\026\197\040\213\133\128\020\036\192\013\159\029\147\185\062\121\013\233\162\218\115\194\230\253\063\056\081\189\022\093\247\250\004\000\000\000\000\073\069\078\068\174\066\096\130"
local NOTICE = "Do not misuse this software. Use only IPTV channels and streams you are authorised to watch. " ..
    "Do not access or redistribute content unlawfully. You are responsible for applicable laws, provider terms " ..
    "and licensing requirements, including a UK TV Licence where required. Availability and playback are not " ..
    "guaranteed. Keep playlists containing passwords or access tokens private. This independent extension " ..
    "is not affiliated with VideoLAN or any broadcaster."

-- VLC calls descriptor() in a restricted Lua state without the standard libraries.
-- Literal metadata and a literal PNG string work there; reading a file does not.
function descriptor()
    return {
        title = "IPTV Channel Player V2",
        version = VERSION,
        author = BRAND,
        url = "https://github.com/TABARC-Code/VLC-IPTV-Plugin-Studio-V2",
        shortdesc = "IPTV Channel Player V2",
        description = "Load your CSV, filter channels, play a selection and export M3U inside VLC. " .. NOTICE,
        icon = ICON,
        capabilities = {}
    }
end

IPTV = {} -- Pure helpers are exposed so the regression suite can test the real implementation.
local FIELDS = {"id", "name", "group", "country", "language", "stream_url", "logo_url", "tvg_id", "enabled"}
local MAX_BYTES, MAX_ROWS, MAX_SHOWN = 2 * 1024 * 1024, 20000, 1000
local rows, shown, group_values = {}, {}, {}
local dialog, path_input, export_input, search_input, groups, include_disabled, channel_list, status, help_widget
local loaded_path, overwrite_armed, help_open = nil, nil, false

local function trim(text)
    return (text:gsub("^%s+", ""):gsub("%s+$", ""))
end

local function html(text)
    return (text:gsub("&", "&amp;"):gsub("<", "&lt;"):gsub(">", "&gt;"):gsub('"', "&quot;"))
end

local function is_enabled(row)
    local value = row.enabled:lower()
    return value == "true" or value == "1" or value == "yes"
end

function IPTV.csv_line(line)
    local cells, parts, quoted, finished, started = {}, {}, false, false, false
    local i = 1
    while i <= #line do
        local c = line:sub(i, i)
        if quoted then
            if c == '"' then
                if line:sub(i + 1, i + 1) == '"' then
                    parts[#parts + 1] = '"'
                    i = i + 1
                else
                    quoted, finished = false, true
                end
            else
                parts[#parts + 1] = c
            end
        elseif c == "," then
            cells[#cells + 1] = trim(table.concat(parts))
            parts, finished, started = {}, false, false
        elseif c == '"' then
            if started or finished then return nil, "Unexpected quote in an unquoted field." end
            quoted, started = true, true
        elseif finished then
            if c ~= " " and c ~= "\t" then return nil, "Unexpected text after a closing quote." end
        else
            parts[#parts + 1] = c
            if c ~= " " and c ~= "\t" then started = true end
        end
        i = i + 1
    end
    if quoted then return nil, "Unclosed quote. CSV fields must stay on one line." end
    cells[#cells + 1] = trim(table.concat(parts))
    return cells
end

function IPTV.parse_csv(data)
    if #data > MAX_BYTES then return nil, "CSV exceeds the 2 MiB limit." end
    data = data:gsub("^\239\187\191", "") -- Excel's UTF-8 BOM is harmless.
    local header, map, result, seen, line_number = nil, {}, {}, {}, 0
    for line in (data .. "\n"):gmatch("(.-)\n") do
        line_number = line_number + 1
        line = line:gsub("\r$", "")
        if line ~= "" then
            if line:find("[\r%z]") then return nil, "Row " .. line_number .. ": embedded control character." end
            local cells, err = IPTV.csv_line(line)
            if not cells then return nil, "Row " .. line_number .. ": " .. err end
            if not header then
                header = cells
                for index, key in ipairs(header) do
                    if map[key] then return nil, "Duplicate CSV column: " .. key end
                    map[key] = index
                end
                for _, key in ipairs(FIELDS) do
                    if not map[key] then return nil, "Missing CSV column: " .. key end
                end
            else
                if #cells ~= #header then return nil, "Row " .. line_number .. ": wrong number of columns." end
                local row = {}
                for _, key in ipairs(FIELDS) do row[key] = cells[map[key]] end
                if row.id == "" or row.name == "" then return nil, "Row " .. line_number .. ": ID and name are required." end
                if seen[row.id] then return nil, "Row " .. line_number .. ": duplicate ID." end
                if not row.stream_url:match("^[%a][%w+%.%-]*:") then return nil, "Row " .. line_number .. ": stream URL needs a scheme." end
                local flag = row.enabled:lower()
                if flag ~= "true" and flag ~= "false" and flag ~= "1" and flag ~= "0" and flag ~= "yes" and flag ~= "no" then
                    return nil, "Row " .. line_number .. ": Enabled must be true or false."
                end
                seen[row.id] = true
                result[#result + 1] = row
                if #result > MAX_ROWS then return nil, "CSV exceeds the 20,000-record limit." end
            end
        end
    end
    if not header then return nil, "CSV is empty; include the column header." end
    return result
end

function IPTV.filter(source, query, group, show_disabled)
    local result = {}
    query = query:lower()
    for index, row in ipairs(source) do
        local haystack = (row.name .. " " .. row.group .. " " .. row.country .. " " .. row.language):lower()
        if (show_disabled or is_enabled(row)) and (not group or row.group == group) and haystack:find(query, 1, true) then
            result[#result + 1] = index
        end
    end
    return result
end

function IPTV.m3u(source)
    local lines, count = {"#EXTM3U"}, 0
    local function attr(value) return (value:gsub('"', "'")) end
    for _, row in ipairs(source) do
        if is_enabled(row) then
            lines[#lines + 1] = '#EXTINF:-1 tvg-id="' .. attr(row.tvg_id) .. '" tvg-name="' .. attr(row.name) ..
                '" tvg-logo="' .. attr(row.logo_url) .. '" group-title="' .. attr(row.group) .. '",' .. row.name
            lines[#lines + 1] = row.stream_url
            count = count + 1
        end
    end
    return table.concat(lines, "\n") .. "\n", count
end

local function file_open(path, mode)
    -- VLC's wrapper handles UTF-8 paths more consistently than stock Lua io on Windows.
    if vlc.io and vlc.io.open then return vlc.io.open(path, mode) end
    return io.open(path, mode)
end

local function exists(path)
    local file = file_open(path, "rb")
    if file then file:close(); return true end
    return false
end

local function clean_path(text)
    text = trim(text)
    if text:sub(1, 1) == '"' and text:sub(-1) == '"' then text = text:sub(2, -2) end
    if text:sub(1, 2) == "~/" or text:sub(1, 2) == "~\\" then text = vlc.config.homedir() .. text:sub(2) end
    return text
end

function IPTV.path_key(path, windows)
    if windows == nil then windows = package.config:sub(1, 1) == "\\" end
    if windows then path = path:gsub("\\", "/") end
    local prefix, rest = path:match("^(file://[^/]*)(/.*)$")
    if not prefix then
        prefix, rest = path:match("^(%a:/)(.*)$")
        if not prefix then
            if path:sub(1, 2) == "//" then prefix, rest = "//", path:sub(3)
            elseif path:sub(1, 1) == "/" then prefix, rest = "/", path:sub(2)
            else prefix, rest = "", path end
        end
    else
        prefix, rest = prefix .. "/", rest:sub(2)
    end
    local parts = {}
    for part in rest:gmatch("[^/]+") do
        if part == ".." then
            if #parts > 0 and parts[#parts] ~= ".." then table.remove(parts)
            elseif prefix == "" then parts[#parts + 1] = part end
        elseif part ~= "." then parts[#parts + 1] = part end
    end
    local key = prefix .. table.concat(parts, "/")
    return windows and key:lower() or key
end

function IPTV.same_path(left, right)
    -- VLC supplies the current directory for relative paths; compare both in the same form.
    if vlc.strings and vlc.strings.make_uri then
        local left_ok, left_uri = pcall(vlc.strings.make_uri, left)
        local right_ok, right_uri = pcall(vlc.strings.make_uri, right)
        if left_ok and right_ok and type(left_uri) == "string" and type(right_uri) == "string" then
            left, right = left_uri, right_uri
        end
    end
    return IPTV.path_key(left) == IPTV.path_key(right)
end

local function say(message)
    if status then status:set_text(html(message)) end
end

local function settings_path()
    return vlc.config.configdir() .. "/iptv-channel-player-last-path.txt"
end

local function default_csv()
    local file = file_open(settings_path(), "rb")
    if file then
        local value = file:read(4096)
        file:close()
        if value and value ~= "" and not value:find("[\r\n%z]") then return value end
    end
    return vlc.config.userdatadir() .. "/lua/extensions/iptv-channel-player-assets/channels.csv"
end

function refresh_channels()
    local selected_group = group_values[groups:get_value()]
    local filtered = IPTV.filter(rows, search_input:get_text(), selected_group, include_disabled:get_checked())
    channel_list:clear()
    shown = {}
    for position = 1, math.min(#filtered, MAX_SHOWN) do
        local index, row = filtered[position], rows[filtered[position]]
        shown[index] = true
        local prefix = is_enabled(row) and "" or "[disabled] "
        channel_list:add_value(prefix .. row.name .. (row.group ~= "" and (" | " .. row.group) or ""), index)
    end
    say(#filtered .. " matching / " .. #rows .. " total." .. (#filtered > MAX_SHOWN and " Showing the first 1,000; refine the filter." or " Select a channel, then Play selected."))
end

function load_csv()
    local path = clean_path(path_input:get_text())
    if path == "" then say("Enter the full path to your CSV first."); return end
    if path:find("[\r\n%z]") then say("CSV path must be a single line."); return end
    local file = file_open(path, "rb")
    if not file then say("Cannot open CSV. Check the path and file permissions."); return end
    local data = file:read(MAX_BYTES + 1)
    file:close()
    if not data then say("Cannot read CSV."); return end
    local imported, err = IPTV.parse_csv(data)
    if not imported then say(err .. " The previous list is still loaded."); return end
    -- Validate the complete replacement before touching the current selection.
    rows, loaded_path, overwrite_armed = imported, path, nil
    groups:clear()
    group_values = {}
    groups:add_value("All groups", 1)
    local names, found = {}, {}
    for _, row in ipairs(rows) do
        if not found[row.group] then names[#names + 1] = row.group; found[row.group] = true end
    end
    table.sort(names)
    for index, name in ipairs(names) do
        local id = index + 1
        group_values[id] = name
        groups:add_value(name == "" and "Ungrouped" or name, id)
    end
    local setting = file_open(settings_path(), "wb")
    if setting then setting:write(path); setting:close() end -- Only the local filename is remembered.
    refresh_channels()
end

local function selected_items()
    local selected, indices, items = channel_list:get_selection(), {}, {}
    for index in pairs(selected) do if shown[index] then indices[#indices + 1] = index end end
    table.sort(indices)
    for _, index in ipairs(indices) do
        local row = rows[index]
        if not is_enabled(row) then return nil, "A selected channel is disabled. Enable it in your CSV and reload." end
        items[#items + 1] = {path = row.stream_url, name = row.name, arturl = row.logo_url, genre = row.group, language = row.language}
    end
    return items
end

function play_selected()
    local items, err = selected_items()
    if not items then say(err); return end
    if #items ~= 1 then say("Select one enabled channel to play."); return end
    vlc.playlist.add(items)
    say("Channel handed to VLC. Use VLC's normal playback controls.")
end

function queue_selected()
    local items, err = selected_items()
    if not items then say(err); return end
    if #items == 0 then say("Select at least one enabled channel to queue."); return end
    vlc.playlist.enqueue(items)
    say("Queued " .. #items .. " selected channels; playback was not started.")
end

function queue_enabled()
    local items = {}
    for _, row in ipairs(rows) do
        if is_enabled(row) then items[#items + 1] = {path = row.stream_url, name = row.name, arturl = row.logo_url, genre = row.group} end
    end
    if #items == 0 then say("No enabled channels. Edit your CSV, save it, then Reload CSV."); return end
    vlc.playlist.enqueue(items)
    say("Queued all " .. #items .. " enabled channels, regardless of the filter.")
end

local function unique_path(base)
    for n = 1, 100 do
        local candidate = base .. "." .. os.time() .. "." .. n
        if not exists(candidate) then return candidate end
    end
    return nil
end

function IPTV.write_m3u(path, content, allow_replace)
    if exists(path) and not allow_replace then return nil, "exists" end
    local temp = unique_path(path .. ".tmp")
    if not temp then return nil, "Cannot choose a temporary filename." end
    local file = file_open(temp, "wb")
    if not file then return nil, "Cannot write here. Check the output folder and permissions." end
    local written = file:write(content)
    local closed = file:close()
    if not written or not closed then os.remove(temp); return nil, "Write failed; original playlist preserved." end
    local backup
    if exists(path) then
        backup = unique_path(path .. ".backup")
        if not backup or not os.rename(path, backup) then
            os.remove(temp); return nil, "Cannot back up the existing playlist; it was left in place."
        end
    end
    if not os.rename(temp, path) then
        local restored = not backup or os.rename(backup, path)
        os.remove(temp)
        return nil, restored and "Cannot finish export; original playlist preserved." or "Export failed; recover the original from its .backup file."
    end
    return true, backup
end

function export_m3u()
    if not loaded_path then say("Load a CSV before exporting."); return end
    local path = clean_path(export_input:get_text())
    if not path:lower():match("%.m3u8?$") or path:find("[\r\n%z]") then
        say("Enter a local output filename ending in .m3u or .m3u8."); return
    end
    if IPTV.same_path(path, loaded_path) then say("Choose a different output file from the CSV source."); return end
    local content, count = IPTV.m3u(rows)
    if count == 0 then say("No enabled channels to export."); return end
    local ok, detail = IPTV.write_m3u(path, content, overwrite_armed == path)
    if not ok and detail == "exists" then
        overwrite_armed = path
        say("Output exists. Choose Export M3U again to replace it and keep a backup, or change the filename.")
        return
    end
    overwrite_armed = nil
    if not ok then say(detail); return end
    say("Exported all " .. count .. " enabled channels." .. (detail and " A backup of the previous playlist was kept." or ""))
end

function show_help()
    help_open = not help_open
    if not help_open then dialog:del_widget(help_widget); help_widget = nil; return end
    -- Create the rich-text panel only while it is visible. An empty browser still takes room in Qt.
    help_widget = dialog:add_html("<h3>Getting started</h3><p>Paste your CSV's full local path and choose <b>Load / Reload CSV</b>. " ..
        "Select one enabled channel and choose <b>Play selected</b>. Queue buttons add to VLC's playlist without starting playback. " ..
        "Apply filter after changing search or group. Search uses simple case folding.</p>" ..
        "<p>Edit channels in Excel, LibreOffice or the optional Python companion; save as UTF-8 CSV and reload here. " ..
        "Required header: <code>id,name,group,country,language,stream_url,logo_url,tvg_id,enabled</code>. " ..
        "Use unique IDs, playable URLs and true/false for enabled. Quote commas. Examples are disabled placeholders.</p>" ..
        "<p>Export includes all enabled channels. Replacing an existing M3U requires a second click and keeps a backup. " ..
        "Keep the export and its backups private if they contain access tokens.</p><p>" .. html(NOTICE) .. "</p>", 1, 9, 6, 1, 760, 220)
end

function show_csv_guide()
    if help_widget then dialog:del_widget(help_widget) end
    help_open = true
    help_widget = dialog:add_html("<h3>Make your own CSV</h3><p>Open the installed channels.csv in Excel or LibreOffice. " ..
        "Keep all nine header cells. Put one channel on each row. Enter a unique ID, a name and a playable stream URL. " ..
        "Set enabled to true only for a stream you are authorised to use; optional cells can stay blank. " ..
        "Save as UTF-8 CSV and choose Load / Reload CSV.</p><p><code>" ..
        "id,name,group,country,language,stream_url,logo_url,tvg_id,enabled</code></p>" ..
        "<h3>Optional AI prompt</h3><p>Copy the following into an AI assistant. Share only public URLs or placeholders; " ..
        "put private access tokens into your local file afterwards. This extension does not upload your list.</p>" ..
        "<p>Format the channel details I supply as UTF-8 comma-separated CSV with this exact header: " ..
        "id,name,group,country,language,stream_url,logo_url,tvg_id,enabled. Use unique IDs. Quote commas and double " ..
        "embedded quotation marks. Keep fields on one line. Leave unknown metadata blank. Never invent working " ..
        "stream URLs, credentials or claims of permission. If a URL is missing, use an example.org placeholder " ..
        "and enabled=false. Use enabled=true only where I explicitly mark my supplied stream as authorised. " ..
        "Return CSV only, without a Markdown fence. My channel details follow: [paste public details here].</p>" ..
        "<p>The full CSV_GUIDE.md and AI_CSV_PROMPT.md files include worked examples and troubleshooting.</p>", 1, 9, 6, 1, 760, 240)
end

function activate()
    dialog = vlc.dialog("IPTV Channel Player V2 | " .. VERSION .. " | " .. BRAND)
    local asset_dir = vlc.config.userdatadir() .. "/lua/extensions/iptv-channel-player-assets"
    if exists(asset_dir .. "/brand.png") then pcall(function() dialog:add_image(asset_dir .. "/brand.png", 1, 1, 1, 1, 64, 64) end) end
    dialog:add_label("<b>IPTV Channel Player V2</b><br>" .. BRAND .. " · " .. VERSION .. " · Native VLC extension", 2, 1, 5, 1)
    dialog:add_label("CSV file", 1, 2)
    path_input = dialog:add_text_input(default_csv(), 2, 2, 4, 1, 560, 28)
    dialog:add_button("Load / Reload CSV", load_csv, 6, 2)
    dialog:add_label("Search", 1, 3)
    search_input = dialog:add_text_input("", 2, 3, 2, 1)
    groups = dialog:add_dropdown(4, 3, 1, 1)
    groups:add_value("All groups", 1)
    include_disabled = dialog:add_check_box("Show disabled", false, 5, 3)
    dialog:add_button("Apply filter", refresh_channels, 6, 3)
    channel_list = dialog:add_list(1, 4, 6, 1, 760, 280)
    dialog:add_button("Play selected", play_selected, 1, 5, 2, 1)
    dialog:add_button("Queue selected", queue_selected, 3, 5, 2, 1)
    dialog:add_button("Queue all enabled", queue_enabled, 5, 5, 2, 1)
    dialog:add_label("M3U output", 1, 6)
    local initial = default_csv():gsub("[^/\\]+$", "") .. "playlist.m3u"
    export_input = dialog:add_text_input(initial, 2, 6, 4, 1)
    dialog:add_button("Export M3U", export_m3u, 6, 6)
    status = dialog:add_label("Load your CSV to begin. Supplied examples are disabled placeholders.", 1, 7, 6, 1)
    dialog:add_button("Help & usage", show_help, 1, 8, 2, 1)
    dialog:add_button("CSV & AI guide", show_csv_guide, 3, 8, 2, 1)
    dialog:add_button("Close extension", close, 5, 8, 2, 1)
    if exists(default_csv()) then load_csv() end
    local notice_file = vlc.config.configdir() .. "/iptv-channel-player-notice-seen.txt"
    if not exists(notice_file) then
        show_help()
        local marker = file_open(notice_file, "wb")
        if marker then marker:write(VERSION); marker:close() end
    end
end

function meta_changed()
    -- Some VLC 3 builds send metadata events even without an explicit listener capability.
end

function deactivate()
    if dialog then dialog:delete() end
    dialog, help_widget = nil, nil
    rows, shown, group_values = {}, {}, {}
    loaded_path, overwrite_armed, help_open = nil, nil, false
end

function close()
    vlc.deactivate()
end
