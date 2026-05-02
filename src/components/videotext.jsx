import React, { useState, useRef } from 'react';

const VideoToText = () => {
    const [outputText, setOutputText] = useState('Translation will appear here...');
    const [isCapturing, setIsCapturing] = useState(false);
    const videoRef = useRef(null);
    const captureButtonRef = useRef(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            captureButtonRef.current.disabled = false;
        } catch (err) {
            alert('Error accessing camera: ' + err.message);
        }
    };
    // const captureAndTranslate = async () => {
    //     setIsCapturing(true);
    //     setOutputText('Processing...');
    
    //     const canvas = document.createElement('canvas');
    //     const video = videoRef.current;
    //     canvas.width = video.videoWidth;
    //     canvas.height = video.videoHeight;
    //     const ctx = canvas.getContext('2d');
    //     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    //     const imageData = canvas.toDataURL('image/png');
    //     try {
    //         const response = await fetch('http://localhost:5000/api/translate', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ image: imageData }),
    //         });
    
    //         if (!response.ok) throw new Error('Translation failed.');
    
    //         const result = await response.json();
    //         setOutputText(result.translation || 'No translation available.');
    //     } catch (error) {
    //         setOutputText('Error: ' + error.message);
    //     } finally {
    //         setIsCapturing(false);
    //     }
    // };
    

    const captureAndTranslate = async () => {
        setIsCapturing(true);
        setOutputText('Processing...');

        const canvas = document.createElement('canvas');
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/png');
        // Call Google API or custom model to translate the video frame to text
        try {
            const response = await fetch('https://example-google-api-endpoint.com/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageData }),
            });

            if (!response.ok) throw new Error('Translation failed.');

            const result = await response.json();
            setOutputText(result.translation || 'No translation available.');
        } catch (error) {
            setOutputText('Error: ' + error.message);
        } finally {
            setIsCapturing(false);
        }
    };

    return (
        <div className="container">
            <h2>Translate Sign Language Video to Text</h2>
            <video ref={videoRef} autoPlay muted></video>
            <button
                id="startButton"
                onClick={startCamera}
                disabled={isCapturing}
            >
                Start Camera
            </button>
            <button
                id="captureButton"
                onClick={captureAndTranslate}
                ref={captureButtonRef}
                disabled={isCapturing}
            >
                Capture and Translate
            </button>
            <div className="output" id="output">
                {outputText}
            </div>
        </div>
    );
};

export default VideoToText;
