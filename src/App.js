import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const videoRef = useRef(null);
  const [videoStream, setVideoStream] = useState(null);

  // Start video streaming
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      videoRef.current.srcObject = stream;
      videoRef.current.play();  // Ensure video is playing
    } catch (err) {
      console.error('Error accessing webcam: ', err);
      alert('Unable to access the camera. Please check permissions and try again.');
    }
  };

  // Capture frame from video and send it to the server for face recognition
  const captureFrame = async () => {
    if (!videoStream) {
      alert('Camera is not active.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg');

    try {
      const response = await axios.post('http://localhost:5000/identify', { image: imageData });
      alert(`Identified person: ${response.data.name}`);
    } catch (err) {
      console.error('Error identifying face: ', err);
      alert('Failed to identify face. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>Face Recognition</h1>
      <video ref={videoRef} autoPlay />
      <button onClick={startVideo}>Start Video</button>
      <button onClick={captureFrame}>Capture Frame</button>
    </div>
  );
}

export default App;
