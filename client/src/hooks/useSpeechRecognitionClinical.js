import { useEffect, useState } from "react";

export const useSpeechRecognitionClinical = (
  setFormDatas,
  inputTextBeforeSpeech
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
            console.log("final");
            console.log(
              "inputTextBeforeSpeech.current",
              inputTextBeforeSpeech.current
            );
            console.log("transcriptSegment", transcriptSegment);
            setFormDatas((p) => {
              return {
                ...p,
                MyClinicalNotesContent:
                  inputTextBeforeSpeech.current + " " + transcriptSegment,
              };
            });
            inputTextBeforeSpeech.current += " " + transcriptSegment;
          } else {
            console.log("interim");
            const currentInterimTranscript =
              interimTranscript + transcriptSegment;
            interimTranscript += transcriptSegment;
            setFormDatas((p) => {
              return {
                ...p,
                MyClinicalNotesContent:
                  inputTextBeforeSpeech.current +
                  " " +
                  currentInterimTranscript,
              };
            });
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
  }, [inputTextBeforeSpeech, setFormDatas]);

  return {
    isListening,
    setIsListening,
    recognition,
  };
};
