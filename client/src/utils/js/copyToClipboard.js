export const copyToClipboard = async (newWindow, element) => {
  newWindow.window.focus();
  await newWindow.window.navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([element.outerHTML], { type: "text/html" }),
    }),
  ]);
};

export const copyClinicalNoteToClipboard = async (bodyRef) => {
  await navigator.clipboard.writeText(bodyRef.current.innerText);
};

export const copyCredentialToClipboard = async (str) => {
  await navigator.clipboard.writeText(str);
};
