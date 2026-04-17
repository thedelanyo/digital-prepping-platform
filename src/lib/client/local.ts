export const getLocalData = <T>(key: string, fallback: T): T => {
  const storage = localStorage.getItem(key);
  return storage ? JSON.parse(storage) : fallback;
};

export const setLocalData = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};
