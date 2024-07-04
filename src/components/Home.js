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
        console.log('From Server: ' + message)
      } else if (msg === "Connection Made") {
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
  // const [qrCode, setQRCode] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [msg, setMsg] = useState('');
  // const navigate = useNavigate()

  // const getqr = async () => {
  //   console.log('Called GetQR')
  //   setLoading(true);
  //   const res = await fetch('http://localhost:3001/getqr')
  //   const data = await res.json()
  //   setQRCode(data.qr?data.qr:'')
  //   setMsg(data.msg?data.msg:'')
  //   setLoading(false)
  //   setTimeout(()=>{
  //     navigate('/playground')
  //   }, 5000)
  // };

  // return (
  //   <div className="Home">
  //     <h1>WhatsApp Web Connector</h1>
  //     <button onClick={getqr} disabled={loading}>
  //       {loading ? 'Generating...' : 'Get Qr'}
  //     </button>

  //     {msg && <p className="msg">{msg}</p>}
  //     {qrCode && <QRCode value={qrCode} size={256} />}
  //   </div>
  // );
};

export default Home;