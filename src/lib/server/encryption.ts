import { APP_ENCRYPT_KEY } from "$env/static/private";
import { APP_ENCRYPT_IV } from "$env/static/private";
import aes from "crypto-js/aes";
import mode from "crypto-js/mode-ecb";
import padding from "crypto-js/pad-pkcs7";
import Utf8 from "crypto-js/enc-utf8";

export const encryptData = <T>(data: T) => {
  const key = Utf8.parse(APP_ENCRYPT_KEY);
  const iv = Utf8.parse(APP_ENCRYPT_IV);
  const text = JSON.stringify(data);
  const encrypted = aes.encrypt(text, key, { iv, mode, padding });

  return encrypted.toString();
};

export const decryptData = <T>(cipher: string): T | null => {
  try {
    const key = Utf8.parse(APP_ENCRYPT_KEY);
    const iv = Utf8.parse(APP_ENCRYPT_IV);
    const decrypted = aes.decrypt(cipher, key, { iv, mode, padding });

    return JSON.parse(decrypted.toString(Utf8));
  } catch {
    return null;
  }
};
