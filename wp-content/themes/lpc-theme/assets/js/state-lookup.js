const input = document.getElementById("stateInput");
const message = document.getElementById("stateMessage");
// STATE_REGIONS can be edited in wp-admin UI
const stateMap = buildMapFromGroups(STATE_REGIONS);

simpleLookup(input, message, stateMap);
