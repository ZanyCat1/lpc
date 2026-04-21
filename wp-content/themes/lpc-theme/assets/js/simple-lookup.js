function simpleLookup(inputEl, outputEl, map) {
  if (!inputEl || !outputEl || !map) return;
  inputEl.addEventListener("input", () => {
    const value = inputEl.value.trim().toUpperCase();

    if (!map[value]) {
      outputEl.style.display = "none";
      return;
    }

    outputEl.textContent = map[value];
    outputEl.style.display = "block";
  });
}

function buildMapFromGroups(groups) {
  const map = {};
  for (const group in groups) {
    groups[group].forEach((item) => {
      map[item] = group;
    });
  }
  return map;
}
