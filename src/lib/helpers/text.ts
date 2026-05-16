export const trimSpaces = (str: string) => {
  return str.replace(/\s+/g, " ").trim();
};

export const truncateString = (str: string, maxLength: number) => {
  return str.length <= maxLength ? str : str.slice(0, maxLength) + "...";
};

export const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const getSearchParams = (params: URLSearchParams, filter = "") => {
  let results = "";

  for (const [key, value] of params) {
    if (key !== filter) {
      results += `&${key}=${value}`;
    }
  }

  return results.replace("&", "");
};
