function arrayBufferToBinaryString(buffer: Iterable<number>) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

function binaryStringToBase64(binary: string) {
  return window.btoa(binary);
}

function base64ToDataURL(base64: string, mimeType: string) {
  return `data:${mimeType};base64,${base64}`;
}

export const arrayBufferToDataURL = (
  buffer: Iterable<number>,
  mimeType: string
) => {
  const binary = arrayBufferToBinaryString(buffer);
  const base64 = binaryStringToBase64(binary);
  return base64ToDataURL(base64, mimeType);
};
