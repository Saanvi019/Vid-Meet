import React from 'react'
import { useState,useEffect } from 'react'
import io from'socket.io-client';

const Chat = ({socket,remoteSocketId,myId,showChat,toggleChat}) => {

  const[message, setMessage]=useState('');
  const[chat,setChat]=useState([]);
  //const [showChat, setShowChat] = useState(false);


  useEffect(()=>{

    if(!socket)return;

    socket.on('chat-message',({from,text})=>{
      setChat((prev)=>[...prev,{sender: from, message: text }]);//This creates a new array containing all previous chat messages plus the new one at the end.Updates the chat state with this new array.
    });

    return ()=> socket.off('chat-message');
  },[socket]);

  const sendMessage=()=>{
    console.log('entered',socket.id);
    //if(!message.trim() || !remoteSocketId || !socket || !socket.emit)return;
    console.log("out if ");
      socket.emit('chat-message',{ //sends an event(ie. chat-message)to the server.
        
        to:remoteSocketId.current,
        from:myId,
        text:message
      });
      console.log("Sending:", { to: remoteSocketId, from: myId, text: message });
      setChat((prev)=>[...prev,{sender:myId,message}]);

      //Clears the input field after sending.So the user can type a new message
      setMessage('');
    
  }

  return (
    
      <>
      {showChat && (
        <div className="chatbox">
          <div className="messages">
            {chat.map((msg, i) => (
              <p key={i}>
                <strong>{msg.sender === myId ? 'You' : 'Peer'}:</strong> {msg.message}
              </p>
            ))}
          </div>

          <div className="inputbox">
            <input
              className="type"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="send" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>


  )
}

export default Chat