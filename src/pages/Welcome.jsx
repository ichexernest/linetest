import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Title from '/images/title.png';
import Logo from '/images/logo.png';
import { useRoute } from '../provider/routeProvider';

const Welcome = () => {
    const [isMobile, setIsMobile] = useState(false);
    const  {dispatch} = useRoute()

    const handleTurnPage =  () => {
        dispatch({ type: 'go_routing', payload: 2 })
    }

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
            <div className="flex flex-col items-center justify-between h-screen">
                      <div className='w-screen flex justify-center items-center mt-10'>
        <img src={Title} className='w-2/5' alt="Title" />
      </div>
                <div className="text-center mb-44">
                    <p className="text-2xl mb-4 font-bold text-blue-900">請使用手機進行訪問此頁面</p>
                </div>
                <div className='w-screen flex justify-center items-center mb-10'>
        <img src={Logo} className='w-[250px]' alt="Logo" />
      </div>
            </div>
        );
    }

    return (
        <>
      <div className='w-screen flex justify-center items-center mt-10'>
        <img src={Title} className='w-4/5' alt="Title" />
      </div>
      <div className='bg-white bg-opacity-40 border-blue-900 border-4 m-6 rounded-lg p-6'>
      <p className='text-blue-900 font-bold text-lg'>每位爸爸都是家庭中的無名英雄，默默付出，守護著我們的幸福與健康。他們總是在我們身邊，給予無限的支持和愛。</p>

      <p className='text-blue-900 font-bold text-lg mt-3'>為您最愛的爸爸設計專屬卡片，送上最適合他的超能力，表達您的感謝與愛意。分享卡片後，您還可獲得特別優惠券。</p>

      <p className='text-blue-900 font-bold text-lg mt-3'>立即開始設計，為最愛的超級英雄送上滿滿的力量和愛吧！</p>
      </div>
                <button className='p-5 text-2xl bg-[#FED501] text-blue-900 rounded-xl shadow-md font-extrabold border-4 border-blue-800' onClick={handleTurnPage}> 開始製作！ </button>
            {/* <Link to={`/share`}> <button> share </button></Link> */}
            <div className='w-screen flex justify-center items-center mb-10'>
        <img src={Logo} className='w-[200px] mt-10' alt="Logo" />
      </div>
        </>
    );
}

export default Welcome;
