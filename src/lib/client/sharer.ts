type Options = { title?: string; text?: string; files?: File[]; url?: string };

export const sharer = async (options: Options) => {
  try {
    await navigator.share(options);

    return true;
  } catch {
    return false;
  }
};
