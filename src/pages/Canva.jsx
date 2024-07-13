import React, { useState, useRef, useEffect } from 'react';
import liff from "@line/liff";

const Canva = ({ onImageSave }) => {
    const canvasRef = useRef(null);
    const [color, setColor] = useState('white');

    const handleColorChange = (newColor) => {
        setColor(newColor);
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL('image/png');
        onImageSave(dataURL);
        alert(`Image URL: ${dataURL}`);
    };

    const drawCanvas = (context) => {
        context.fillStyle = color;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        drawCanvas(context);
    }, [color]);

    return (
        <div>
            <h1>Canvas Drawing Area</h1>
            <canvas ref={canvasRef} width={500} height={500} style={{ border: '1px solid black' }} />
            <div>
                <button onClick={() => handleColorChange('red')}>Red</button>
                <button onClick={() => handleColorChange('green')}>Green</button>
                <button onClick={() => handleColorChange('blue')}>Blue</button>
                <button onClick={handleSave}>Save as Image</button>
            </div>
        </div>
    );
};

const Share = () => {
    const [message, setMessage] = useState("");
    const [isLiffReady, setIsLiffReady] = useState(false);
    const [error, setError] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        liff
            .init({
                liffId: import.meta.env.VITE_LIFF_ID
            })
            .then(() => {
                setMessage("LIFF init succeeded.");
                setIsLiffReady(true);
            })
            .catch((e) => {
                setMessage("LIFF init failed.");
                setError(`${e}`);
            });
    }, []);

    const handleSend2friend = () => {
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            if (liff.isApiAvailable('shareTargetPicker')) {
                liff.shareTargetPicker(
                    [
                        {
                            type: "image",
                            originalContentUrl: imageUrl,
                            previewImageUrl: imageUrl,
                        },
                    ],
                    {
                        isMultiple: true,
                    }
                )
                .then(function (res) {
                    if (res) {
                        // succeeded in sending a message through TargetPicker
                        console.log(`[${res.status}] Message sent!`);
                    } else {
                        // sending message canceled
                        console.log("TargetPicker was closed!");
                    }
                })
                .catch(function (error) {
                    // something went wrong before sending a message
                    console.log("something wrong happen");
                });
            }
        }
    };

    const handleSendMessage = () => {
        if (!liff.isLoggedIn()) {
            liff.login();
        } else {
            liff.sendMessages([
                {
                    type: 'text',
                    text: 'Hi'
                }
            ]).then(() => {
                alert('Message sent');
            }).catch((err) => {
                console.error('Error sending message:', err);
            });
        }
    };

    return (
        <div className="App">
            <h1>create-liff-app</h1>
            {message && <p>{message}</p>}
            {error && (
                <p>
                    <code>{error}</code>
                </p>
            )}
            <a
                href="https://developers.line.biz/ja/docs/liff/"
                target="_blank"
                rel="noreferrer"
            >
                LIFF Documentation HOME
            </a>

            <div>
                <h1>Welcome to Line LIFF App</h1>
                <Canva onImageSave={setImageUrl} />
                {isLiffReady ? (
                    <>
                        <button onClick={handleSendMessage}>Send Message</button>
                        <button onClick={handleSend2friend} disabled={!imageUrl}>Send Image to Friend</button>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

export default Share;
