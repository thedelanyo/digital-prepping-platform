export const shuffle = <T>(items: T[]) => {
  return items
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
};

export const randomItem = <T>(items: T[]) => {
  let pos = Math.floor(Math.random() * items.length);

  return items[pos];
};
