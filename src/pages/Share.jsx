import React, { useState, useEffect } from 'react';
import liff from "@line/liff";
import Canva from './Canva';
import Title from '/images/title.png';

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
                      handleSendMessage()
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
                  text: '感謝您遊玩，折價券1000萬'
              }
          ]).then(() => {
              alert('Message sent');
          }).catch((err) => {
              console.error('Error sending message:', err);
          });
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
  
  return (
      <div className="container flex-col w-screen justify-center items-center">
        <div className='w-screen flex justify-center items-center mt-5'>
        <img src={Title} className='w-4/5'></img>
        </div>
          {/* <a
              href="https://developers.line.biz/ja/docs/liff/"
              target="_blank"
              rel="noreferrer"
          >
              LIFF Documentation HOME
          </a> */}

              <p>{imageUrl}</p>
              <Canva onImageSave={handleUploadImage} />
              <div className='flex'>
              {isLiffReady ? (
                  <>
                      {/* <button onClick={handleSendMessage}>Send Message</button> */}
                      <button onClick={handleSend2friend} disabled={!imageUrl} className='p-2 m-2 rounded-md w-44 text-white bg-green-500 disabled:bg-gray-300'>Send Image to Friend</button>
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