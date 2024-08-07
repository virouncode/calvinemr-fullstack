import PaperclipIcon from "../Icons/PaperclipIcon";

const AttachFilesButton = ({ onClick, attachments }) => {
  return (
    <>
      <label>Attach files</label>
      <PaperclipIcon onClick={onClick} ml={5} />
      {attachments.map((attachment) => (
        <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
          {attachment.alias},
        </span>
      ))}
    </>
  );
};

export default AttachFilesButton;
