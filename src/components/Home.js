import React, { useEffect, useState } from 'react';
import { QRCode } from "react-qr-code";
import { useNavigate } from "react-router-dom"

const Home = () => {
  const [qrCode, setQrCode] = useState(null)
  const [text, setText] = useState(null)
  const navigate = useNavigate()
  let socket;

  useEffect(function () {
    socket = new WebSocket("ws://localhost:3001")
    socket.onopen = function () {
      console.log("Connected")
    }
  }, [])

  async function connect() {
    await socket.send("/connect")
    socket.onmessage = function (message) {

      const msg = message.data

      if (msg.slice(0, 3) === "qr:") {
        setQrCode(msg.slice(3))
      } else if (msg.slice(0, 3) === "id:") {
        localStorage.setItem("id", msg.slice(3))
        navigate('/playground')
      } else {
        setText(msg)
      }

    }
  }

  return (
    <>
      {text && <p>{text}</p>}
      {qrCode && <QRCode value={qrCode} />}
      <button onClick={connect}>Connect</button>
    </>
  )
};

export default Home;