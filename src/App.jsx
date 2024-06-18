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
        LIFF Documentation
      </a>

      <div>
      <h1>Welcome to Line LIFF App</h1>
      {isLiffReady ? (
        <button onClick={handleSendMessage}>Send Message to Friend</button>
      ) : (
        <p>Loading...</p>
      )}
    </div>
    </div>
  );
}

export default App;
