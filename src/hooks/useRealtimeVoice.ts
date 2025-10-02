import { useState, useRef, useCallback, useEffect } from 'react';
import { useToast } from './use-toast';
import { UserProfile } from '@/types/profile';

interface RealtimeVoiceOptions {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onAudioData?: (audioData: Uint8Array) => void;
  onStatusChange?: (status: 'disconnected' | 'connecting' | 'connected' | 'error') => void;
}

export const useRealtimeVoice = (profile: UserProfile | null, options: RealtimeVoiceOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<Uint8Array[]>([]);
  const isPlayingRef = useRef(false);
  const hasPendingAudioRef = useRef(false);
  const lastAudioActivityRef = useRef<number>(0);
  const silenceIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  const updateStatus = useCallback((newStatus: typeof status) => {
    setStatus(newStatus);
    options.onStatusChange?.(newStatus);
  }, [options]);

  const playAudioChunk = useCallback(async (audioData: Uint8Array) => {
    if (!audioContextRef.current) return;

    try {
      // Convert PCM16 to AudioBuffer
      const int16Array = new Int16Array(audioData.buffer);
      const float32Array = new Float32Array(int16Array.length);
      
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = audioContextRef.current.createBuffer(
        1,
        float32Array.length,
        24000
      );
      audioBuffer.getChannelData(0).set(float32Array);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => {
        isPlayingRef.current = false;
        playNextInQueue();
      };
      
      source.start(0);
      isPlayingRef.current = true;
      setIsSpeaking(true);
    } catch (error) {
      console.error('Error playing audio:', error);
      isPlayingRef.current = false;
      playNextInQueue();
    }
  }, []);

  const playNextInQueue = useCallback(() => {
    if (audioQueueRef.current.length > 0 && !isPlayingRef.current) {
      const nextChunk = audioQueueRef.current.shift();
      if (nextChunk) {
        playAudioChunk(nextChunk);
      }
    } else if (audioQueueRef.current.length === 0) {
      setIsSpeaking(false);
    }
  }, [playAudioChunk]);

  const queueAudio = useCallback((audioData: Uint8Array) => {
    audioQueueRef.current.push(audioData);
    if (!isPlayingRef.current) {
      playNextInQueue();
    }
  }, [playNextInQueue]);

  const connect = useCallback(async () => {
    if (isConnected || !profile) {
      if (!profile) {
        toast({
          title: "Profile Required",
          description: "Please complete your profile first.",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      updateStatus('connecting');
      console.log('Starting voice connection with profile:', profile.name);

      // 1) Request microphone access first (more reliable on iOS Safari)
      try {
        mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: {
            // Avoid strict constraints that can fail on mobile Safari
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          } as MediaTrackConstraints
        });
        console.log('Microphone access granted');
      } catch (micError) {
        console.error('Microphone access error:', micError);
        throw new Error('Microphone access denied. Please allow microphone access to use voice chat.');
      }

      // 2) Initialize AudioContext AFTER permission (fixes iOS init issues)
      try {
        const AC: any = (window as any).AudioContext || (window as any).webkitAudioContext;
        if (!AC) throw new Error('Web Audio API not supported in this browser');
        audioContextRef.current = new AC();

        // Resume if needed (autoplay policy)
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        console.log('AudioContext created. sampleRate=', audioContextRef.current.sampleRate, 'state=', audioContextRef.current.state);
      } catch (audioError) {
        console.error('AudioContext creation error:', audioError);
        throw new Error('Failed to initialize audio system. Please check your browser settings.');
      }

      // Double-check AudioContext before using it
      if (!audioContextRef.current) {
        throw new Error('AudioContext is not available');
      }

      // 3) Create audio processor
      const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current!);
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      processorRef.current.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        // Basic energy-based VAD
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        const speaking = rms > 0.01; // simple threshold

        const int16Array = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        const base64Audio = btoa(String.fromCharCode(...new Uint8Array(int16Array.buffer)));

        wsRef.current.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: base64Audio
        }));

        // Track activity to trigger commit on silence
        hasPendingAudioRef.current = true;
        if (speaking) {
          lastAudioActivityRef.current = Date.now();
        }
      };

      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      // Connect to edge function WebSocket
      const wsUrl = `wss://clemkvxneggnokmvgmbj.supabase.co/functions/v1/realtime-voice-coach`;
      console.log('Connecting to:', wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected, sending session init...');

        // Start silence checker (commit on ~800ms silence)
        if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
        lastAudioActivityRef.current = Date.now();
        silenceIntervalRef.current = setInterval(() => {
          if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
          const silentFor = Date.now() - lastAudioActivityRef.current;
          if (hasPendingAudioRef.current && silentFor > 800) {
            console.log('Silence detected, committing audio and requesting response');
            wsRef.current.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
            wsRef.current.send(JSON.stringify({ type: 'response.create' }));
            hasPendingAudioRef.current = false;
          }
        }, 250) as unknown as number;
        
        // Send session initialization with profile
        wsRef.current?.send(JSON.stringify({
          type: 'session.init',
          profile: profile
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Received:', message.type);

          if (message.type === 'session.ready') {
            setIsConnected(true);
            updateStatus('connected');
            toast({
              title: "Voice chat ready!",
              description: "Start speaking to MKRO",
            });
          } else if (message.type === 'response.audio.delta') {
            const binaryString = atob(message.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            queueAudio(bytes);
            options.onAudioData?.(bytes);
          } else if (message.type === 'response.audio_transcript.delta') {
            options.onTranscript?.(message.delta, false);
          } else if (message.type === 'response.audio_transcript.done') {
            options.onTranscript?.(message.transcript, true);
          } else if (message.type === 'response.done') {
            setIsSpeaking(false);
          } else if (message.type === 'error') {
            console.error('Server error:', message.error);
            updateStatus('error');
            toast({
              title: "Error",
              description: message.error,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        updateStatus('error');
        toast({
          title: "Connection error",
          description: "Failed to connect to voice service. Check console for details.",
          variant: "destructive",
        });
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);
        updateStatus('disconnected');
        if (silenceIntervalRef.current) {
          clearInterval(silenceIntervalRef.current);
          silenceIntervalRef.current = null;
        }
        if (event.code !== 1000) {
          toast({
            title: "Connection closed",
            description: `Code: ${event.code}`,
            variant: "destructive",
          });
        }
      };

    } catch (error) {
      console.error('Error connecting:', error);
      updateStatus('error');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start voice chat",
        variant: "destructive",
      });
    }
  }, [profile, isConnected, toast, options, updateStatus, queueAudio]);

  const disconnect = useCallback(() => {
    // Stop audio playback
    audioQueueRef.current = [];
    isPlayingRef.current = false;
    setIsSpeaking(false);

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Stop microphone
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Clean up audio processor
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setIsConnected(false);
    updateStatus('disconnected');
  }, [updateStatus]);

  const sendText = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{
          type: 'input_text',
          text: text
        }]
      }
    }));

    wsRef.current.send(JSON.stringify({
      type: 'response.create'
    }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    isSpeaking,
    status,
    connect,
    disconnect,
    sendText,
  };
};
