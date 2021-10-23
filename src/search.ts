import { Search } from "./types";

export const decodeSearch = (search: string): Search => {
  const params = new URLSearchParams(search);
  const output: Search = {};

  for (const [key, value] of params) {
    const existing = output[key];

    if (existing != null) {
      output[key] =
        typeof existing === "string"
          ? [existing, value]
          : existing.concat(value);
    } else {
      output[key] = value;
    }
  }

  return output;
};

export const appendParam = (
  acc: string,
  key: string,
  value: string,
): string => {
  const output = acc + (acc !== "" ? "&" : "") + encodeURIComponent(key);
  return value !== "" ? output + "=" + encodeURIComponent(value) : output;
};

export const encodeSearch = (search: Search): string => {
  const keys = Object.keys(search);

  if (keys.length === 0) {
    return "";
  }

  let output = "";
  keys.sort(); // keys are sorted in place

  for (const key of keys) {
    const value = search[key];

    if (value == null) {
      continue;
    }

    if (typeof value === "string") {
      output = appendParam(output, key, value);
    } else {
      for (const item of value) {
        output = appendParam(output, key, item);
      }
    }
  }

  if (output === "") {
    return ""; // params are empty arrays
  }

  return "?" + output;
};
