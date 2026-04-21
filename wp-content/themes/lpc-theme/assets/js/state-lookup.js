const input = document.getElementById("stateInput");
const message = document.getElementById("stateMessage");

// STATE_REGIONS can be edited in wp-admin UI

const stateMap = {};
for (const region in STATE_REGIONS) {
  STATE_REGIONS[region].forEach((state) => {
    stateMap[state] = region;
  });
}

input.addEventListener("input", () => {
  let value = input.value.trim().toUpperCase();

  // only act on 2 characters
  if (value.length !== 2) {
    message.style.display = "none";
    return;
  }

  // check mapping
  if (stateMap[value]) {
    message.textContent = stateMap[value];
    message.style.display = "block";
  } else {
    message.style.display = "none";
  }
});
