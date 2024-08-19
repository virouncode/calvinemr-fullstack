// speech-recognition.d.ts

interface SpeechRecognition {
  new (): SpeechRecognitionInstance;
}

type webkitSpeechRecognition = SpeechRecognition;

interface SpeechRecognitionInstance {
  start(): void;
  stop(): void;
  abort(): void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionEvent = {
  resultIndex: number;
  results: SpeechRecognitionResultList;
};

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface Window {
  webkitSpeechRecognition: webkitSpeechRecognition;
}
