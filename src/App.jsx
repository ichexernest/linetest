import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

function App() {
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


  const handleSendMessage = () => {
    if (!liff.isLoggedIn()) {
      liff.login();
    } else {
      liff
      .shareTargetPicker(
        [
          {
            type: "text",
            text: "Hello, World!",
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
        LIFF Documentation
      </a>

      <div>
      <h1>Welcome to Line LIFF App</h1>
      {isLiffReady ? (
        <button onClick={handleSendMessage}>Send Message 2FRND</button>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </div>
  );
}

export default App;
