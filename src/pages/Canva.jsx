import React, { useState, useRef, useEffect } from 'react';
import liff from "@line/liff";


const Canva = ({ onImageSave }) => {
    const canvasRef = useRef(null);
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const [inputText, setInputText] = useState('');

    const handleImageChange = (imageSrc) => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            setImage(img);
        };
    };

    const handleTextChange = (event) => {
        setInputText(event.target.value);
    };

    const handleTextSubmit = () => {
        setText(inputText);
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL('image/png');
        onImageSave(dataURL);
    };

    const drawCanvas = (context) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clear the canvas
        if (image) {
            context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
        } else {
            context.fillStyle = 'white';
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        }
        if (text) {
            context.fillStyle = 'black';
            context.font = '30px Arial';
            const textWidth = context.measureText(text).width;
            context.fillText(text, (context.canvas.width - textWidth) / 2, context.canvas.height / 2);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        drawCanvas(context);
    }, [image, text]);

    return (
        <div>
            <h1>Canvas Drawing Area</h1>
            <canvas ref={canvasRef} width={500} height={500} style={{ border: '1px solid black' }} />
            <div>
                <img
                    src="/images/card1.png"
                    alt="Card"
                    onClick={() => handleImageChange('/images/card1.png')}
                    style={{ cursor: 'pointer', width: '50px', height: '50px', marginRight: '10px' }}
                />
                                <img
                    src="/images/card2.png"
                    alt="Card"
                    onClick={() => handleImageChange('/images/card2.png')}
                    style={{ cursor: 'pointer', width: '50px', height: '50px', marginRight: '10px' }}
                />
                                <img
                    src="/images/card3.png"
                    alt="Card"
                    onClick={() => handleImageChange('/images/card3.png')}
                    style={{ cursor: 'pointer', width: '50px', height: '50px', marginRight: '10px' }}
                />
            </div>
            <div>
                <input
                    type="text"
                    value={inputText}
                    onChange={handleTextChange}
                    placeholder="Enter text"
                />
                <button onClick={handleTextSubmit}>Add Text</button>
            </div>
            <button onClick={handleSave} >Save as Image</button>
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

    const handleUploadImage = async (base64Image) => {
        try {
            const url = await uploadImage(base64Image);
            setImageUrl(url);
        } catch (error) {
            setError(`Image upload failed: ${error.message}`);
        }
    };

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
                        console.log(`[${res.status}] Message sent!`);
                    } else {
                        console.log("TargetPicker was closed!");
                    }
                })
                .catch(function (error) {
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
                <p>{imageUrl}</p>
                <Canva onImageSave={handleUploadImage} />
                {isLiffReady ? (
                    <>
                        {/* <button onClick={handleSendMessage}>Send Message</button> */}
                        <button onClick={handleSend2friend} disabled={!imageUrl}>Send Image to Friend</button>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
};

const uploadImage = async (base64Image) => {
    const formData = new FormData();
    formData.append('image', base64Image.split(',')[1]);  // 去除data:image/png;base64,前綴
    formData.append('type', 'base64');
    formData.append('title', 'Simple upload');
    formData.append('description', 'This is a simple image upload in Imgur');

    const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer 18aacec6155e973f807e9d85dd64ae7bb81343b5',
        },
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.data.error}`);
    }

    const data = await response.json();
    return data.data.link;
};


export default Share;
