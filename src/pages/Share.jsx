import React, { useState, useEffect } from 'react';
import liff from "@line/liff";
import Title from '/images/title.png';
import { useImg } from '../provider/imgProvider';
import { useRoute } from '../provider/routeProvider';
import Logo from '/images/logo.png';

const Share = () => {
  const { Img } = useImg();
  const { dispatch: dispatchRoute } = useRoute();
  const [message, setMessage] = useState("");
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [error, setError] = useState("");

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
              originalContentUrl: Img.currentImg.url,
              previewImageUrl: Img.currentImg.url,
            },
          ],
          {
            isMultiple: true,
          }
        )
          .then((res) => {
            if (res) {
              dispatchRoute({ type: 'go_routing', payload: 4 });
            } else {
              console.log("TargetPicker was closed!");
            }
          })
          .catch((error) => {
            console.log("Something wrong happened:", error);
          });
      }
    }
  };

  return (
    <div className="container flex-col w-screen justify-center items-center">
      <div className='w-screen flex justify-center items-center mt-5'>
        <img src={Title} className='w-4/5' alt="Title" />
      </div>
      <div className='mt-10'>
        <span className='text-xl text-blue-800 font-bold text-center'>恭喜您完成您的卡片！現在馬上發送給親愛的爸爸吧！</span>
      </div>

      <div className='w-screen flex justify-center items-center mt-5'>
        <img src={Img.currentImg.image} className='w-4/5' alt="Shared content" />
      </div>
      <div className='flex flex-col justify-center  items-center'>
        <div>
          <span className='text-sm text-red-600 font-bold text-center w-screen'>小提示：長壓圖片可以儲存到相簿喔！</span>
        </div>
        {isLiffReady ? (
          <div className="mt-4">
            <button onClick={handleSend2friend} disabled={!Img.currentImg.url} className='p-5 text-2xl bg-[#FED501] text-blue-900 rounded-xl shadow-md font-extrabold border-4 border-blue-800 disabled:bg-blue-300'>
              發送卡片！
            </button>
          </div>
        ) : (
          <p>...</p>
        )}

        <div className='w-screen flex justify-center items-center mb-10'>
          <img src={Logo} className='w-[200px] mt-10' alt="Logo" />
        </div>
      </div>
      {/* {message && <p>{message}</p>} */}
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}
    </div>
  );
};

export default Share;
