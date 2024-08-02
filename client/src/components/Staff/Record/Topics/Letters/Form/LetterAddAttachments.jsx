
import CircularProgressSmall from "../../../../../UI/Progress/CircularProgressSmall";

const LetterAddAttachments = ({
  handleAttach,
  isLoadingFile,
  attachments,
  handleRemoveAttachment,
}) => {
  return (
    <div className="letter__options-attachments">
      <div className="letter__options-attachments-title">
        Add attachments
        <i
          className="fa-solid fa-paperclip"
          onClick={handleAttach}
          style={{ cursor: "pointer", marginLeft: "5px" }}
        />
        {isLoadingFile && <CircularProgressSmall />}
        <div>
          {attachments
            .filter(({ type }) => type === "attachment")
            .map((attachment) => (
              <span
                key={attachment.alias}
                style={{
                  marginLeft: "5px",
                  fontWeight: "normal",
                  fontSize: "0.75rem",
                }}
              >
                {attachment.alias}{" "}
                <i
                  className="fa-solid fa-trash"
                  onClick={(e) => handleRemoveAttachment(e, attachment.alias)}
                  style={{ cursor: "pointer", marginLeft: "5px" }}
                />
                ,
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LetterAddAttachments;
