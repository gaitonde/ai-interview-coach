import React, { useCallback } from 'react'
import { useEffect, useRef, useState } from 'react'
import { set } from 'idb-keyval'
import { useAtomValue } from 'jotai'
import { profileIdAtom } from '@/stores/profileAtoms'

interface AudioRecorderProps {
  onTranscriptionComplete: (transcript: string, audioUrl: string) => void
  version: number
  questionId: string
  onRecordingComplete: () => void
}

type RecorderState = 'Ready' | 'Recording' | 'Transcribing';

const FIXED_TIME_LIMIT = 30;

export default function AudioRecorder({ onTranscriptionComplete, version, questionId, onRecordingComplete }: AudioRecorderProps) {
  const [recorderState, setRecorderState] = useState<RecorderState>('Ready')
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const [selectedMimeType, setSelectedMimeType] = useState<string>('audio/webm;codecs=opus')
  const profileId = useAtomValue(profileIdAtom)

  const startRecording = async () => {
    console.log('startRecording called, current state:', { recorderState, mediaRecorderRef: !!mediaRecorderRef.current });

    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      console.log('Microphone permission status:', permissionStatus.state);

      if (permissionStatus.state === 'denied') {
        throw new Error('Microphone permission denied');
      }

      console.log('Requesting media stream...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Media stream obtained:', stream);

      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/mp4',
        'audio/mpeg',
        'audio/wav',
        'audio/aac'
      ];

      // console.log('Testing MIME type support...')
      // for (const type of mimeTypes) {
      //   const isSupported = MediaRecorder.isTypeSupported(type)
      //   console.log(`${type}: ${isSupported ? 'supported' : 'not supported'}`)
      // }

      const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type))
      if (!mimeType) {
        throw new Error('No supported audio MIME type found')
      }

      console.log('Selected MIME type:', mimeType)
      setSelectedMimeType(mimeType);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000 // Try a standard bitrate
      });
      // console.log('MediaRecorder created')

      mediaRecorder.ondataavailable = (event) => {
        // console.log('Data available:', event.data.size, 'bytes')
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
      };

      mediaRecorder.onstop = async () => {
        setRecorderState('Transcribing')

        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: selectedMimeType });
          console.log('Audio blob created:', {
            size: audioBlob.size,
            type: audioBlob.type,
            chunkCount: audioChunksRef.current.length
          });

          if (audioBlob.size === 0) {
            throw new Error('Audio blob is empty');
          }

          const url = URL.createObjectURL(audioBlob);
          console.log('Blob URL created:', url);

          if (!window.matchMedia('(max-width: 768px)').matches) {
            const audio = new Audio();

            audio.onerror = (e) => {
              console.error('Audio error:', {
                error: audio.error,
                code: audio.error?.code,
                message: audio.error?.message,
                networkState: audio.networkState,
                readyState: audio.readyState
              });
            };

            audio.onloadstart = () => console.log('Audio loading started');
            audio.oncanplay = () => console.log('Audio can start playing');
            audio.oncanplaythrough = () => console.log('Audio can play through');

            audio.src = url;
          }

          const key = `audio_v${version}`;
          await set(key, audioBlob);

          const transcription = await getTranscription(audioBlob);
          onTranscriptionComplete(transcription, url);
        } catch (error) {
          console.error('Error in onstop handler:', error);
          onTranscriptionComplete('Transcription failed', '');
        } finally {
          setRecorderState('Ready');
          setRecordingTime(0);
        }
      };

      audioChunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      console.log('Recording started');
      setRecorderState('Recording');
      setRecordingTime(0);
    } catch (error) {
      console.error('Error in startRecording:', error);
      // Provide user feedback
      alert(`Recording failed to start: ${error}`);
      setRecorderState('Ready');
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recorderState === 'Recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setRecorderState('Transcribing');
    }
  }, [recorderState]);

  const handleRecordInteraction = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    console.log('handleRecordInteraction triggered', {
      recorderState,
      eventType: event.type,
      buttonEnabled: !event.currentTarget.getAttribute('disabled'),
      mediaRecorderExists: !!mediaRecorderRef.current
    });

    if (event.currentTarget.getAttribute('disabled') === 'true') {
      console.log('Button is disabled, ignoring click')
      return
    }

    try {
      if (recorderState === 'Ready') {
        console.log('Attempting to start recording...');
        startRecording().catch(error => {
          console.error('Failed to start recording:', error);
          alert(`Failed to start recording: ${error.message}`);
        });
      } else if (recorderState === 'Recording') {
        console.log('Attempting to stop recording...');
        stopRecording();
      }
    } catch (error) {
      console.error('Error in handleRecordInteraction:', error);
      alert(`Recording interaction failed: ${error}`);
    }
  }, [recorderState, stopRecording]);

  const getTranscription = async (audioBlob: Blob): Promise<string> => {
    const audioBase64 = await blobToBase64(audioBlob);

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, questionId, audio: audioBase64 }),
    });

    if (!response.ok) {
      throw new Error('Transcription failed');
    }

    const data = await response.json();
    return data.result;
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  useEffect(() => {
    let stopTimeout: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    if (recorderState === 'Recording') {
      stopTimeout = setTimeout(() => {
        stopRecording();
      }, FIXED_TIME_LIMIT * 1000);

      intervalId = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= FIXED_TIME_LIMIT) {
            clearInterval(intervalId);
            return FIXED_TIME_LIMIT;
          }
          return prevTime + 1;
        });
      }, 1000);
    }

    return () => {
      clearTimeout(stopTimeout);
      clearInterval(intervalId);
    };
  }, [recorderState, FIXED_TIME_LIMIT, stopRecording]);

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <button
          className={`text-white hover:bg-[#059669] py-2 px-4 rounded-md transition-colors touch-none
           ${recorderState === 'Recording' ? 'bg-red-600' : 'bg-[#10B981]'}
            `}
          disabled={recorderState === 'Transcribing'}
          onClick={handleRecordInteraction}
          onTouchStart={(e) => {
            e.stopPropagation()
            handleRecordInteraction(e)
          }}
        >
          {recorderState === 'Ready' ? 'Record Answer' : recorderState === 'Recording' ? 'Stop' : 'Transcribing...'}
        </button>
      </div>

      {recorderState === 'Recording' && (
        <div className="text-sm text-gray-600">
          Recording: {recordingTime}s / {FIXED_TIME_LIMIT}s
        </div>
      )}
    </div>
  );
}