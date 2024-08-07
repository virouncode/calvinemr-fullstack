import MicrophoneIcon from "../../../../UI/Icons/MicrophoneIcon";

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
            <MicrophoneIcon
              onClick={handleStopSpeech}
              color="red"
              top={30}
              right={40}
            />
          ) : (
            <MicrophoneIcon
              onClick={handleStartSpeech}
              color="black"
              top={30}
              right={40}
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
