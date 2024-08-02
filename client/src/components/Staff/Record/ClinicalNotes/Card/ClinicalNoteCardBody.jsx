

const ClinicalNoteCardBody = ({
  clinicalNote,
  inputText,
  editVisible,
  handleChangeText,
  textareaRef,
  isListening,
  handleStopSpeech,
  handleStartSpeech,
}) => {
  return (
    <div className="clinical-notes__card-body">
      {!editVisible ? (
        <p>{clinicalNote.MyClinicalNotesContent}</p>
      ) : (
        <>
          {isListening ? (
            <i
              className="fa-solid fa-microphone"
              onClick={handleStopSpeech}
              style={{
                cursor: "pointer",
                color: "red",
                position: "absolute",
                top: "30px",
                right: "40px",
              }}
            />
          ) : (
            <i
              className="fa-solid fa-microphone"
              onClick={handleStartSpeech}
              style={{
                cursor: "pointer",
                position: "absolute",
                top: "30px",
                right: "40px",
              }}
            />
          )}
          <textarea
            name="MyClinicalNotesContent"
            cols="90"
            rows="20"
            onChange={handleChangeText}
            value={inputText}
            autoFocus
            ref={textareaRef}
          />
        </>
      )}
    </div>
  );
};

export default ClinicalNoteCardBody;
