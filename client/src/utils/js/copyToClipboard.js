export const copyToClipboard = async (newWindow, element) => {
  newWindow.window.focus();
  try {
    newWindow.window.navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([element.outerHTML], { type: "text/html" }),
      }),
    ]);
  } catch (err) {
    throw err;
  }
};

export const copyClinicalNoteToClipboard = async (bodyRef) => {
  try {
    navigator.clipboard.writeText(bodyRef.current.innerText);
  } catch (err) {
    throw err;
  }
};

export const copyCredentialToClipboard = async (str) => {
  try {
    navigator.clipboard.writeText(str);
  } catch (err) {
    throw err;
  }
};
