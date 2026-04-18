export const trimSpaces = (str: string) => {
  return str.replace(/\s+/g, " ").trim();
};

export const truncateString = (str: string, maxLength: number) => {
  return str.length <= maxLength ? str : str.slice(0, maxLength) + "...";
};
