const AttachFilesButton = ({ onClick, attachments }) => {
  return (
    <>
      <label>Attach files</label>
      <i className="fa-solid fa-paperclip" onClick={onClick}></i>
      {attachments.map((attachment) => (
        <span key={attachment.file.name} style={{ marginLeft: "5px" }}>
          {attachment.alias},
        </span>
      ))}
    </>
  );
};

export default AttachFilesButton;
