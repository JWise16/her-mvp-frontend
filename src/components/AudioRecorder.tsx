import React, { useRef, useState } from 'react';

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    setAudioUrl(null);
    setUploadStatus(null);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(audioBlob));
      stream.getTracks().forEach(track => track.stop());

      // Send audio to backend
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      fetch('https://api.ask-allie.com/api/audio', {
        method: 'POST',
        body: formData,
      })
        .then(res => res.json())
        .then(data => setUploadStatus(`Upload success: ${data.message}`))
        .catch(() => setUploadStatus('Upload failed'));
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioUrl && (
        <div>
          <p>Playback:</p>
          <audio src={audioUrl} controls />
        </div>
      )}
      {uploadStatus && <div>{uploadStatus}</div>}
    </div>
  );
};

export default AudioRecorder;
