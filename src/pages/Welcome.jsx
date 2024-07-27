import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Title from '/images/title.png';

const Welcome = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // 判斷是否為手機裝置
        const checkIsMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            if (/android/i.test(userAgent)) {
                return true;
            }
            if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                return true;
            }
            return false;
        };

        setIsMobile(checkIsMobile());
    }, []);

    if (!isMobile) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-2xl mb-4">請使用手機進行訪問此頁面</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <img src={Title} className='w-4/5' alt="Title" />
            <p>this is a welcome page, can display some activity rule, policy, or something</p>
            <Link to={`/canva`}>
                <button className='p-5 text-2xl bg-amber-400 text-white'> start </button>
            </Link>
            {/* <Link to={`/share`}> <button> share </button></Link> */}
        </>
    );
}

export default Welcome;
