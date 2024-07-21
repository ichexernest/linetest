import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';

const Canva = ({ onImageSave }) => {
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

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const handleSave = () => {
        const stage = stageRef.current;
        stage.toDataURL({
            mimeType: 'image/png',
            callback: (dataUrl) => {
                onImageSave(dataUrl);
            }
        });
    };

    const [bgImage] = useImage(image);

    const handleStageMouseDown = (e) => {
        if (e.target === e.target.getStage()) {
            transformerRef.current.nodes([]);
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

    return (
        <div className="w-full p-4">
            <div className="flex justify-center m-3">
                <Stage
                    width={canvasSize.width}
                    height={canvasSize.height}
                    ref={stageRef}
                    onMouseDown={handleStageMouseDown}
                    className=""
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
                            borderStroke="red"
                            borderStrokeWidth={2}
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
