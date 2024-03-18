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

const NO_VALUE_PARAM_REGEXP = /=&/g;
const FINISH_BY_EQUAL_REGEXP = /=$/g;

export const encodeSearch = (search: Search): string => {
  const keys = Object.keys(search);

  if (keys.length === 0) {
    return "";
  }

  const params = new URLSearchParams();
  keys.sort(); // keys are sorted in place

  for (const key of keys) {
    const value = search[key];

    if (value == null) {
      continue;
    }

    if (typeof value === "string") {
      params.append(key, value);
    } else {
      for (const item of value) {
        params.append(key, item);
      }
    }
  }

  const output = params
    .toString()
    .replace(NO_VALUE_PARAM_REGEXP, "&")
    .replace(FINISH_BY_EQUAL_REGEXP, "");

  if (output === "") {
    return "";
  }

  return "?" + output;
};
