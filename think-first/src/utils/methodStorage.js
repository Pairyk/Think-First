import { methods as templates } from "../data/methods";

const STORAGE_KEY = "think-first:methods";

export function loadCustomMethods() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const data = JSON.parse(saved);

    if (!Array.isArray(data)) return [];

    return data.filter(
      (method) =>
        method &&
        typeof method.id === "string" &&
        typeof method.title === "string" &&
        typeof method.category === "string" &&
        Array.isArray(method.blocks) &&
        method.blocks.length > 0 &&
        method.blocks.every(
          (block) =>
            block &&
            typeof block.title === "string" &&
            typeof block.instruction === "string" &&
            Number.isInteger(block.minutes) &&
            block.minutes > 0,
        ),
    );
  } catch {
    return [];
  }
}

export function getMethods() {
  return [...templates, ...loadCustomMethods()];
}

export function saveCustomMethod(method) {
  try {
    const existing = loadCustomMethods();

    const updated = [
      ...existing.filter((item) => item.id !== method.id),
      method,
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return true;
  } catch {
    return false;
  }
}