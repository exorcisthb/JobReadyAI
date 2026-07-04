import { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality, LiveCallbacks } from '@google/genai';

interface UseGeminiLiveProps {
  apiKey: string;
  onMessage?: (message: string, role: 'user' | 'assistant') => void;
  onError?: (error: Error) => void;
  cvData?: string;
}

export function useGeminiLive({ apiKey, onMessage, onError, cvData }: UseGeminiLiveProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioWorkletRef = useRef<AudioWorkletNode | null>(null);

  // Helper to convert base64 to ArrayBuffer
  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  // Initialize Gemini Live session
  const connect = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey });
      
      // System instruction for HR interviewer (from live-api-web-console)
      const systemInstruction = `You are JobReadyAI, a senior HR interviewer and technical interviewer running a realistic mock interview.

Product identity:
- Introduce yourself as JobReadyAI, an AI interview simulator built for candidates who want to practice realistic HR and role-specific interviews.
- Explain briefly that you help users test whether their CV claims are convincing, practice answering under pressure, identify weak spots, and receive improvement advice after the interview.
- Do not claim to be a real employer or a real human HR person.

Interview goal:
- Interview the candidate based on their CV.
- The CV is your roadmap - all questions MUST be within the scope of what's written in the CV.
- Your job is to verify whether the candidate TRULY understands and DID what they claimed in the CV.
- Do NOT ask questions outside the candidate's role or CV scope.

${cvData ? `\nCV của ứng viên:\n${cvData}` : ''}

INTERVIEW LENGTH AND QUESTION RULES:
- Conduct a focused interview with 8-10 questions total (excluding opening greeting and self-introduction).
- Each question should be asked ONLY ONCE. Do NOT repeat the same question.
- You may ask ONE follow-up clarification on a previous answer if needed, but no more than that.
- Track your question count mentally and wrap up naturally after 8-10 substantive questions.
- Quality over quantity - make each question count.

VERIFICATION STRATEGY - CRITICAL:
- For each CV claim, ask from MULTIPLE ANGLES to detect fake CVs:
  1. Ask about the WHAT: "Bạn làm gì cụ thể trong project này?"
  2. Ask about the HOW: "Bạn implement như thế nào? Dùng công cụ/library gì?"
  3. Ask about the WHY: "Tại sao chọn approach đó? Có cân nhắc phương án khác không?"
  4. Ask about the RESULT: "Kết quả ra sao? Có metric cụ thể không?"
  5. Ask about the PROBLEM: "Gặp khó khăn gì? Đã giải quyết thế nào?"
  6. Ask about the ALTERNATIVE: "Nếu làm lại, sẽ thay đổi gì?"

Interview style - CRITICAL RULES:
- Speak in Vietnamese by default unless the candidate asks for English.
- Run the session like a real interview: professional, warm, direct, and rigorous.
- Ask one question at a time.
- Start like a normal interview:
  1. Greet the candidate.
  2. Introduce JobReadyAI in one short sentence.
  3. Immediately ask the candidate to introduce themselves.
  4. Do not mention interview rules, question strategy, or scoring in the opening.
  5. Only after their self-introduction, begin deeper CV and role-specific questions.
- Pronounce "JobReady AI" clearly as "Job-Ready-A-I" (three separate words).

INTERVIEWER BEHAVIOR - DO NOT VIOLATE THESE RULES:
- YOU ARE THE INTERVIEWER, NOT A HELPER. Your job is to ASK QUESTIONS and EVALUATE, not to teach or correct.
- NEVER suggest answers, give hints, or rephrase the candidate's response.
- NEVER say things like "Bạn có thể nói rõ hơn là..." or "Câu trả lời tốt hơn sẽ là...".
- DO NOT provide example answers during the interview.
- DO NOT coach the candidate in real-time.
- If an answer is weak, vague, or wrong, simply note it internally and move to the next question or ask a follow-up to probe deeper.
- Your feedback and suggestions are ONLY given in the final evaluation report, not during the interview.

Voice and confidence evaluation:
- Because this is a voice interview, pay attention to available audio cues: hesitation, long pauses, clarity, pace, confidence, nervousness, and consistency.
- Do not overclaim exact emotion detection. Phrase voice feedback as observations such as "nghe có vẻ", "có dấu hiệu", or "giọng trả lời khá chắc".

FINAL EVALUATION REPORT - When interview ends:
Provide a structured evaluation report in Vietnamese with:
- TỔNG ĐIỂM: [X]/100
- ĐIỂM NỘI DUNG: [X]/70 (Technical Knowledge, CV Authenticity, Critical Thinking, Communication)
- ĐIỂM GIỌNG NÓI & THÁI ĐỘ: [X]/30 (Speech Rate, Confidence, Coherence)
- ĐÁNH GIÁ TỔNG QUAN (Hiring Signal, Strengths, Weaknesses)
- LỘ TRÌNH CẢI THIỆN (Specific actionable steps)
- ĐỀ XUẤT CẢI THIỆN CV (How to rewrite CV based on weak points)
- VÍ DỤ CÂU TRẢ LỜI TỐT HƠN (Example better answers for weak responses)

Bắt đầu bằng cách chào hỏi và yêu cầu ứng viên giới thiệu bản thân.`;

      console.log('🔄 Connecting to Gemini Live API...');

      // Setup callbacks
      const callbacks: LiveCallbacks = {
        onopen: () => {
          console.log('✅ Connected to Gemini Live API');
          setIsConnected(true);
        },
        onmessage: async (message: any) => {
          // Handle setup complete
          if (message.setupComplete) {
            console.log('✅ Setup complete, sending greeting...');
            // Send initial greeting
            sessionRef.current?.sendClientContent({ 
              turns: [{ text: 'Xin chào! Hãy bắt đầu buổi phỏng vấn.' }], 
              turnComplete: true 
            });
            return;
          }

          // Handle server content
          if (message.serverContent) {
            const { serverContent } = message;

            // Handle interruption
            if ('interrupted' in serverContent) {
              console.log('⚠️ Interrupted');
              return;
            }

            // Handle turn complete
            if ('turnComplete' in serverContent) {
              console.log('✓ Turn complete');
            }

            // Handle model turn (text and audio)
            if ('modelTurn' in serverContent) {
              const parts = serverContent.modelTurn?.parts || [];

              for (const part of parts) {
                // Handle text
                if (part.text) {
                  console.log('🤖 AI text:', part.text);
                  onMessage?.(part.text, 'assistant');
                }

                // Handle audio
                if (part.inlineData?.mimeType?.startsWith('audio/pcm')) {
                  const audioData = part.inlineData.data;
                  const arrayBuffer = base64ToArrayBuffer(audioData);
                  await playAudioPCM(arrayBuffer);
                }
              }
            }
          }
        },
        onerror: (error: ErrorEvent) => {
          console.error('❌ Gemini error:', error);
          onError?.(new Error(error.message));
        },
        onclose: (event: CloseEvent) => {
          console.log('🔌 Connection closed:', event.reason);
          setIsConnected(false);
        }
      };
      
      const session = await ai.live.connect({
        model: 'models/gemini-2.5-flash-native-audio-latest',
        config: {
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          generationConfig: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: 'Aoede' // Female voice (same as smile-clinic)
                }
              }
            }
          }
        },
        callbacks
      });

      sessionRef.current = session;

    } catch (error) {
      console.error('❌ Failed to connect to Gemini:', error);
      onError?.(error as Error);
      setIsConnected(false);
    }
  };

  // Disconnect session
  const disconnect = () => {
    if (sessionRef.current) {
      try {
        sessionRef.current.close?.();
      } catch (e) {
        console.error('Error closing session:', e);
      }
      sessionRef.current = null;
    }
    stopListening();
    setIsConnected(false);
  };

  // Start listening to user's microphone with optimized AudioWorklet
  const startListening = async () => {
    if (isListening) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      mediaStreamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      // Optimized AudioWorklet with buffering (from smile-clinic)
      const workletCode = `
        class AudioProcessor extends AudioWorkletProcessor {
          constructor() {
            super();
            this.GAIN = 1.5; // Amplify microphone
            this.audioBuffer = new Int16Array(1024);
            this.bufferWriteIndex = 0;
          }

          convertFloat32ToInt16(float32Array) {
            const int16Array = new Int16Array(float32Array.length);
            for (let i = 0; i < float32Array.length; i++) {
              const s = Math.max(-1, Math.min(1, float32Array[i] * this.GAIN));
              int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            return int16Array;
          }

          sendAudioBuffer() {
            const data = this.audioBuffer.slice(0, this.bufferWriteIndex);
            this.port.postMessage({ audio: data.buffer }, [data.buffer]);
            this.audioBuffer = new Int16Array(1024);
            this.bufferWriteIndex = 0;
          }

          process(inputs, outputs, parameters) {
            const input = inputs[0];
            if (!input || !input[0]) return true;

            const float32Data = input[0];
            const int16Data = this.convertFloat32ToInt16(float32Data);

            // Buffer audio data
            for (let i = 0; i < int16Data.length; i++) {
              this.audioBuffer[this.bufferWriteIndex++] = int16Data[i];
              if (this.bufferWriteIndex >= this.audioBuffer.length) {
                this.sendAudioBuffer();
              }
            }

            return true;
          }
        }
        registerProcessor('audio-processor', AudioProcessor);
      `;

      const blob = new Blob([workletCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      await audioContext.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);

      const source = audioContext.createMediaStreamSource(stream);
      const worklet = new AudioWorkletNode(audioContext, 'audio-processor');
      audioWorkletRef.current = worklet;

      worklet.port.onmessage = (e) => {
        if (e.data.audio && sessionRef.current && isConnected) {
          const pcm16 = new Uint8Array(e.data.audio);
          let binary = '';
          for (let i = 0; i < pcm16.length; i++) {
            binary += String.fromCharCode(pcm16[i]);
          }
          const base64 = btoa(binary);
          
          sessionRef.current.sendRealtimeInput?.({ 
            media: {
              mimeType: 'audio/pcm;rate=16000',
              data: base64
            }
          });
        }
      };

      source.connect(worklet);
      setIsListening(true);
      console.log('🎙️ Microphone started with optimized processing');
    } catch (error) {
      console.error('Failed to start listening:', error);
      onError?.(error as Error);
    }
  };

  // Stop listening
  const stopListening = () => {
    if (audioWorkletRef.current) {
      audioWorkletRef.current.disconnect();
      audioWorkletRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    setIsListening(false);
    console.log('🛑 Microphone stopped');
  };

  // Play PCM audio from Gemini with better buffering
  const playAudioPCM = async (arrayBuffer: ArrayBuffer) => {
    try {
      // Use 24kHz sample rate (Gemini's output rate)
      const audioContext = new AudioContext({ sampleRate: 24000 });
      
      // Convert PCM16 to Float32
      const pcm16 = new Int16Array(arrayBuffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }

      // Create audio buffer with proper channel configuration
      const audioBuffer = audioContext.createBuffer(1, float32.length, 24000);
      audioBuffer.copyToChannel(float32, 0);

      // Create and configure source
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // Add gain node for volume control
      const gainNode = audioContext.createGain();
      gainNode.gain.value = 1.0;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Play with smooth start
      source.start(0);
      
      console.log('🔊 Playing audio chunk:', float32.length, 'samples');
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  };

  // Send text message
  const sendMessage = async (text: string) => {
    if (sessionRef.current && isConnected) {
      try {
        sessionRef.current.sendClientContent?.({ 
          turns: [{ text }], 
          turnComplete: true 
        });
        onMessage?.(text, 'user');
      } catch (error) {
        console.error('Failed to send message:', error);
        onError?.(error as Error);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    isListening,
    connect,
    disconnect,
    startListening,
    stopListening,
    sendMessage
  };
}
