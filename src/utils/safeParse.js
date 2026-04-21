function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return;
  }
}

export default safeParse;
