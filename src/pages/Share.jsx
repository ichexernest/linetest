import React, { useState, useEffect } from 'react';
import liff from "@line/liff";
import Title from '/images/title.png';
import { useImg } from '../provider/imgProvider';

const Share = () => {
  const { Img } = useImg();
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
          .then(function (res) {
            if (res) {
              console.log(`[${res.status}] Message sent!`);
              handleSendMessage();
            } else {
              console.log("TargetPicker was closed!");
            }
          })
          .catch(function (error) {
            console.log("something wrong happened");
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
          text: '感謝您遊玩，折價券1000萬'
        }
      ]).then(() => {
        alert('Message sent');
      }).catch((err) => {
        console.error('Error sending message:', err);
      });
    }
  };

  return (
    <div className="container flex-col w-screen justify-center items-center">
      <div className='w-screen flex justify-center items-center mt-5'>
        <img src={Title} className='w-4/5' alt="Title" />
      </div>
      <div className='w-screen flex justify-center items-center mt-5'>
        <img src={Img.currentImg.image} className='w-4/5' alt="Shared content" />
      </div>
      <div className='flex'>
        {isLiffReady ? (
          <>
            <button onClick={handleSend2friend} disabled={!Img.currentImg.url} className='p-2 m-2 rounded-md w-44 text-white bg-green-500 disabled:bg-gray-300'>
              Send Image to Friend
            </button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {message && <p>{message}</p>}
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}
    </div>
  );
};

export default Share;
