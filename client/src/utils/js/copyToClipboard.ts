<<<<<<< HEAD
import NewWindow from "react-new-window";

export const copyToClipboard = async (
  newWindow: NewWindow,
  element: HTMLElement
) => {
  newWindow.window?.focus();
  await newWindow.window?.navigator.clipboard.write([
=======
export const copyToClipboard = async (
  newWindow: Window,
  element: HTMLElement
) => {
  newWindow.focus();
  await newWindow.navigator.clipboard.write([
>>>>>>> aa4bc09 (wow)
    new ClipboardItem({
      "text/html": new Blob([element.outerHTML], { type: "text/html" }),
    }),
  ]);
};

export const copyClinicalNoteToClipboard = async (
  bodyRef: React.MutableRefObject<HTMLDivElement | null>
) => {
  if (bodyRef.current)
    await navigator.clipboard.writeText(bodyRef.current.innerText);
};

export const copyCalvinAIMsgToClipboard = async (
  bodyRef: React.MutableRefObject<HTMLParagraphElement | null>
) => {
  if (bodyRef.current)
    await navigator.clipboard.writeText(bodyRef.current.innerText);
};

export const copyCredentialToClipboard = async (str: string) => {
  await navigator.clipboard.writeText(str);
};
