import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Title from '/images/title.png';
import Logo from '/images/logo.png';
import { useRoute } from '../provider/routeProvider';

const Award = () => {
    const  {dispatch} = useRoute()

    const handleTurnPage =  () => {
        dispatch({ type: 'go_routing', payload: 1 })
    }

    return (
        <>
      <div className='w-screen flex justify-center items-center mt-10'>
        <img src={Title} className='w-4/5' alt="Title" />
      </div>
      <div className='bg-white bg-opacity-40 border-blue-900 border-4 m-6 rounded-lg p-6'>
      <p className='text-blue-900 font-bold text-lg'>恭喜您完成了您的卡片，希望爸爸可以確實地收到您的祝福。</p>
      <p className='text-blue-900 font-bold text-lg mt-3'>感謝您的參與，您的優惠券100元</p>
      <p className='text-blue-900 font-bold text-2xl my-8'>GBFDCD2488</p>
      <p className='text-blue-900 font-bold text-lg'>使用期限至2024/12/31,歡迎複製或截圖避免優惠碼丟失</p>
      </div>
                <button className='p-5 text-2xl bg-[#FED501] text-blue-900 rounded-xl shadow-md font-extrabold border-4 border-blue-800' onClick={handleTurnPage}> 再玩一次！ </button>
            {/* <Link to={`/share`}> <button> share </button></Link> */}
            <div className='w-screen flex justify-center items-center mb-10'>
        <img src={Logo} className='w-[200px] mt-10' alt="Logo" />
      </div>
        </>
    );
}

export default Award;
