import ReactQuill from "react-quill-new";

export const copyToClipboard = async (
  newWindow: Window,
  element: HTMLElement
) => {
  newWindow.focus();
  await newWindow.navigator.clipboard.write([
    new ClipboardItem({
      "text/html": new Blob([element.outerHTML], { type: "text/html" }),
    }),
  ]);
};

export const copyClinicalNoteToClipboard = async (
  quillRef: React.MutableRefObject<ReactQuill | null>
) => {
  if (quillRef.current) {
    await navigator.clipboard.writeText(
      quillRef.current.getEditor().root.innerText
    );
  }
};

export const copyCalvinAIMsgToClipboard = async (
  bodyRef: React.MutableRefObject<HTMLParagraphElement | null>
) => {
  if (bodyRef.current)
    await navigator.clipboard.writeText(bodyRef.current.innerText);
};

export const copyTextToClipboard = async (str: string) => {
  await navigator.clipboard.writeText(str);
};
