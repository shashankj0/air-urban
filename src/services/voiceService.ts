/**
 * Web Speech API Service
 * Supports Speech-to-Text and Text-to-Speech
 */

export class VoiceAssistantService {
  private recognition: any = null;
  private isListening: boolean = false;
  private synth: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
      }

      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
    }
  }

  public isSpeechSupported(): boolean {
    return this.recognition !== null;
  }

  public isSynthesisSupported(): boolean {
    return this.synth !== null;
  }

  public startListening(
    onResult: (transcript: string) => void,
    onError: (err: any) => void,
    onEnd: () => void,
    lang: string = 'en-US'
  ) {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser.');
      return;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }

    this.recognition.lang = lang;
    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      onError(e);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synth) return;

    // Cancel any ongoing speech
    this.synth.cancel();

    // Clean text of markdown and technical characters for audio clarity
    const cleanText = text
      .replace(/[#*`_~]/g, '')
      .replace(/µg\/m³/g, 'micrograms per cubic meter')
      .replace(/CO2e/g, 'CO2 equivalent');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = () => onEnd();
    }

    this.synth.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const voiceService = new VoiceAssistantService();
