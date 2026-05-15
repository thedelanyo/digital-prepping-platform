export const downloadFile = async (id: string, name: string) => {
  try {
    const url = `https://drive.google.com/uc?export=download&id=${id}`;

    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();

    name = name.includes(".pdf") ? name : `${name}.pdf`;

    const file = new File([blob], name, { type: blob.type });

    return file;
  } catch (e: any) {
    console.log({ call: "downloadFile", message: e.message });
    return null;
  }
};
