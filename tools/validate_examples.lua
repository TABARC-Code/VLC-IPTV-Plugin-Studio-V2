local root = arg[1] or "."
dofile(root .. "/iptv-channel-player.lua")
for _, name in ipairs({"blank-template.csv", "starter-categories.csv", "metadata-and-quoting.csv"}) do
    local file = assert(io.open(root .. "/examples/" .. name, "rb"))
    local rows = assert(IPTV.parse_csv(file:read("*a")))
    file:close()
    print(name .. ": " .. #rows .. " valid records")
end
