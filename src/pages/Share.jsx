import React, { useState, useEffect } from 'react';
import liff from "@line/liff";

const Share = () => {
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
        });
      
        const handleSend2friend = () => {
          if (!liff.isLoggedIn()) {
            liff.login();
          } else {
            if (liff.isApiAvailable('shareTargetPicker')) {
              liff.shareTargetPicker(
                [
                  {
                    type: "image",
                    originalContentUrl: "https://qph.cf2.quoracdn.net/main-qimg-8d32a33a298a62cac96aef0806c78b89-lq",
                    previewImageUrl: "https://qph.cf2.quoracdn.net/main-qimg-8d32a33a298a62cac96aef0806c78b89-lq",
                  },
                ],
                {
                  isMultiple: true,
                }
              )
              .then(function (res) {
                if (res) {
                  // succeeded in sending a message through TargetPicker
                  console.log(`[${res.status}] Message sent!`);
                } else {
                  // sending message canceled
                  console.log("TargetPicker was closed!");
                }
              })
              .catch(function (error) {
                // something went wrong before sending a message
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
            {isLiffReady ? (
              <>
              <button onClick={handleSendMessage}>Send Message</button>
              <button onClick={handleSend2friend}>Send Message 2Friend</button>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          </div>
        );
      }
export default Share;