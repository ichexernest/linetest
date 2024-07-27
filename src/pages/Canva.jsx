import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useImg } from '../provider/imgProvider';
import { useNavigate } from 'react-router-dom';

const Canva = () => {
    const navigate = useNavigate()
    const {dispatch}=useImg()
    const stageRef = useRef(null);
    const textRef = useRef(null);
    const transformerRef = useRef(null);
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const [inputText, setInputText] = useState('');
    const [textColor, setTextColor] = useState('#000000'); // 初始文字颜色为黑色
    const [textPosition, setTextPosition] = useState({ x: 50, y: 50, fontSize: 30 });
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth * 0.9, height: window.innerWidth * 0.9 });

    const handleResize = () => {
        const size = window.innerWidth * 0.9;
        setCanvasSize({ width: size, height: size });
    };

    const handleUploadImage = async (base64Image) => {
        try {
            const url = await uploadImage(base64Image);
            return url
        } catch (error) {
            setError(`Image upload failed: ${error.message}`);
        }
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

    const handleImageChange = (imageSrc) => {
        setImage(imageSrc);
    };

    const handleTextChange = (event) => {
        const value = event.target.value;
        if (value.length <= 100) {
            setInputText(value);
        }
    };

    const handleTextSubmit = () => {
        setText(inputText);
        setTimeout(() => {
            transformerRef.current.nodes([textRef.current]);
            transformerRef.current.getLayer().batchDraw();
        }, 0);
    };

    const handleColorChange = (event) => {
        setTextColor(event.target.value);
    };

    const handleSave = async  () => {
        const transformer = transformerRef.current;
        transformer.nodes([]);
        const stage = stageRef.current;
        const dataUrl = stage.toDataURL({ pixelRatio: 3 }); // 將 pixelRatio 設為 3 或更高
        const url = await handleUploadImage(dataUrl);
        const img = {
            image: dataUrl,
            url: url
        }
        dispatch({ type: 'save_img', payload: img })
        setTimeout(() => {
            transformer.nodes([textRef.current]);
            transformer.getLayer().batchDraw();
        }, 0);
        navigate('/Share')
    };

    const [bgImage] = useImage(image);

    const handleStageMouseDown = (e) => {
        if (e.target === e.target.getStage()) {
            // 不要关闭控制框
        }
    };


    const handleTransform = (e) => {
        const node = textRef.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);
        setTextPosition({
            x: node.x(),
            y: node.y(),
            fontSize: node.fontSize() * Math.max(scaleX, scaleY),
        });
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        transformerRef.current.nodes([textRef.current]);
        transformerRef.current.getLayer().batchDraw();
    }, [text]);

    useEffect(() => {
        handleImageChange('/images/card1.png')
    }, [text]);
    return (
        <div className="w-full p-4">
            <div className="flex justify-center m-3">
                <Stage
                    width={canvasSize.width}
                    height={canvasSize.height}
                    ref={stageRef}
                    onMouseDown={handleStageMouseDown}
                    className="border border-black"
                >
                    <Layer>
                        {bgImage && (
                            <KonvaImage
                                x={0}
                                y={0}
                                width={canvasSize.width}
                                height={canvasSize.height}
                                image={bgImage}
                            />
                        )}
                        <Text
                            ref={textRef}
                            text={text}
                            x={textPosition.x}
                            y={textPosition.y}
                            fontSize={textPosition.fontSize}
                            fill={textColor}
                            draggable
                            name="text"
                            onDragEnd={(e) => {
                                setTextPosition({ ...textPosition, x: e.target.x(), y: e.target.y() });
                            }}
                            onTransformEnd={handleTransform}
                            onDragMove={(e) => {
                                setTextPosition({ ...textPosition, x: e.target.x(), y: e.target.y() });
                            }}
                        />
                        <Transformer
                            ref={transformerRef}
                            boundBoxFunc={(oldBox, newBox) => {
                                if (newBox.width < 30 || newBox.height < 30) {
                                    return oldBox;
                                }
                                return newBox;
                            }}
                            rotateEnabled={false}
                            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                            borderStrokeWidth={2} // 设置控制框线宽
                        />
                    </Layer>
                </Stage>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
                <img
                    src="/images/card1.png"
                    alt="Card"
                    onClick={() => handleImageChange('/images/card1.png')}
                    className="cursor-pointer w-12 h-12"
                />
                <img
                    src="/images/card2.png"
                    alt="Card"
                    onClick={() => handleImageChange('/images/card2.png')}
                    className="cursor-pointer w-12 h-12"
                />
                <img
                    src="/images/card3.png"
                    alt="Card"
                    onClick={() => handleImageChange('/images/card3.png')}
                    className="cursor-pointer w-12 h-12"
                />
            </div>
            <div className="flex justify-center mt-4 space-x-2">
                <textarea
                    value={inputText}
                    onChange={handleTextChange}
                    placeholder="Enter text"
                    className="border p-2"
                    rows="4"
                    cols="50"
                />
                <button onClick={handleTextSubmit} className="bg-blue-500 text-white p-2 rounded">Add Text</button>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
                <label htmlFor="textColor" className="flex items-center space-x-2">
                    <span className="text-gray-700">Text Color:</span>
                    <input
                        type="color"
                        id="textColor"
                        value={textColor}
                        onChange={handleColorChange}
                        className="border p-1"
                    />
                </label>
            </div>
            <div className="flex justify-center mt-4">
                <button onClick={handleSave} className="bg-green-500 text-white p-2 rounded">Save as Image</button>
            </div>
        </div>
    );
};

export default Canva;
