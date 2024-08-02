function arrayBufferToBinaryString(buffer) {
  let binary = "";
  let bytes = new Uint8Array(buffer);
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}

function binaryStringToBase64(binary) {
  return window.btoa(binary);
}

function base64ToDataURL(base64, mimeType) {
  return `data:${mimeType};base64,${base64}`;
}

export const arrayBufferToDataURL = (buffer, mimeType) => {
  const binary = arrayBufferToBinaryString(buffer);
  const base64 = binaryStringToBase64(binary);
  return base64ToDataURL(base64, mimeType);
};
