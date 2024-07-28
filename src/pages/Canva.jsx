import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { useImg } from '../provider/imgProvider';
import { useRoute } from '../provider/routeProvider';

const Canva = () => {
    const { dispatch } = useImg();
    const { dispatch: dispatchRoute } = useRoute();
    const stageRef = useRef(null);
    const textRef = useRef(null);
    const transformerRef = useRef(null);
    const [image, setImage] = useState(null);
    const [text, setText] = useState('');
    const [inputText, setInputText] = useState('');
    const [textColor, setTextColor] = useState('#000000'); // 初始文字颜色为黑色
    const [textPosition, setTextPosition] = useState({ x: 100, y: 100, fontSize: 30 });
    const [canvasSize, setCanvasSize] = useState({ width: window.innerWidth * 0.9, height: window.innerWidth * 0.9 });
    const [isLoading, setIsLoading] = useState(false); // loading狀態

    const handleResize = () => {
        const size = window.innerWidth * 0.9;
        setCanvasSize({ width: size, height: size });
    };

    const handleUploadImage = async (base64Image) => {
        try {
            const url = await uploadImage(base64Image);
            return url;
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

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const transformer = transformerRef.current;
            transformer.nodes([]);
            const stage = stageRef.current;
            const dataUrl = stage.toDataURL({ pixelRatio: 3 }); // 將 pixelRatio 設為 3 或更高
            const url = await handleUploadImage(dataUrl);
            const img = {
                image: dataUrl,
                url: url
            };
            dispatch({ type: 'save_img', payload: img });
            setTimeout(() => {
                transformer.nodes([textRef.current]);
                transformer.getLayer().batchDraw();
            }, 0);
            dispatchRoute({ type: 'go_routing', payload: 3 });
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
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
        handleImageChange('/images/card1.png');
    }, [text]);

    return (
        <div className="w-full p-4">
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                    <div className="text-4xl font-bold text-blue-800">正在生成卡片...</div>
                </div>
            )}
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
            <div>
                <span className='text-sm text-red-600 font-bold text-center w-screen'>小提示：您可以直接在卡片上移動縮放你的文字內容</span>
            </div>
            <span className='text-xl text-blue-800 font-bold text-center'>第一步.選擇卡片</span>
            <div className="flex justify-center mt-4 space-x-2 mb-5">
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
            <span className='text-xl text-blue-800 font-bold text-center'>第二步.寫下您的祝福</span>
            <div className="flex justify-center mt-4 space-x-2">
                <textarea
                    value={inputText}
                    onChange={handleTextChange}
                    placeholder="Enter text"
                    className="border p-2"
                    rows="3"
                    cols="50"
                />
                <button onClick={handleTextSubmit} className="bg-blue-800 text-white font-bold p-2 rounded">寫上卡片</button>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
                <label htmlFor="textColor" className="flex items-center space-x-2">
                    <span className="text-xl text-blue-800 font-bold">選擇文字顏色</span>
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
                <button className='p-5 text-2xl bg-[#FED501] text-blue-900 rounded-xl shadow-md font-extrabold border-4 border-blue-800' onClick={handleSave}> 我做好了，去分享！ </button>
            </div>
        </div>
    );
};

export default Canva;
