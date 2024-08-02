import { useEffect, useState } from "react";

export const useSpeechRecognition = (
  setInputText,
  inputTextBeforeSpeech,
  formDatas = null
) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  useEffect(() => {
    let speechRecognition;
    if ("webkitSpeechRecognition" in window) {
      speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = "en-CA";
      speechRecognition.onstart = () => {
        console.log("Speech recognition started");
      };
      speechRecognition.onresult = (event) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setInputText(
              inputTextBeforeSpeech.current + " " + transcriptSegment
            );
            formDatas &&
              localStorage.setItem(
                "currentNewClinicalNote",
                JSON.stringify({
                  ...formDatas,
                  MyClinicalNotesContent:
                    inputTextBeforeSpeech.current + " " + transcriptSegment,
                })
              );
            inputTextBeforeSpeech.current += " " + transcriptSegment;
          } else {
            interimTranscript += transcriptSegment;
            setInputText(
              inputTextBeforeSpeech.current + " " + interimTranscript
            );
          }
        }
      };
      speechRecognition.onerror = (event) => {
        setIsListening(false);
        console.error("Speech recognition error:", event.error);
      };
      speechRecognition.onend = () => {
        setIsListening(false);
        console.log("Speech recognition ended");
      };
      setRecognition(speechRecognition);
    } else {
      console.error("Web Speech API is not supported in this browser");
    }

    // Cleanup function
    return () => {
      if (speechRecognition) {
        speechRecognition.stop();
      }
    };
  }, [inputTextBeforeSpeech, setInputText, formDatas]);

  return {
    isListening,
    setIsListening,
    recognition,
  };
};
