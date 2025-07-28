import React, { useEffect, useRef } from "react";
import "../App.css";
import { useState } from "react";
import io from "socket.io-client";
import Chat from "./Chat";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiMicrophoneOn } from "react-icons/ci";
import { CiMicrophoneOff } from "react-icons/ci";
import { IoVideocamOutline , IoVideocamOffOutline} from "react-icons/io5";
import axios from "axios";

export const Video = ({username}) => {
  const [startVideo, setstartVideo] = useState(false);
  const [myId, setmyId] = useState(false);
  const [showChat, setshowChat] = useState(false);
  const localvideoRef = useRef(null);
  const remotevideoRef = useRef(null);
  const localPeer = useRef(null);
  const localstream=useRef(null);
  const remotePeer = useRef(null);
  const remoteSocketId = useRef(null);
  const socket = useRef(null);
  const [isMuted,setIsMuted]=useState(false);
  const [cameraOff,setcameraOff]=useState(false);
   const BASE_URL = 'https://vid-meet-backend.onrender.com';
   const pendingCandidates = useRef([]);
const [remoteId, setRemoteId] = useState(null); // NEW

  useEffect(() => {
    if (!socket.current) {
      socket.current = io('ws://vid-meet-backend.onrender.com');
      console.log(socket.current);
      //remotePeer.current=io('http://localhost:4000');
      //remoteSocketId.current= remotePeer.current.id;
    }

    socket.current.on("connect", () => {
      console.log("connected my ID: ", socket.current.id);
      setmyId(socket.current.id);
      //socket.current.emit("join");
    });

    /*socket.current.on("join", () => {
      console.log(" joined:", socket.current.id);
    });*/

    socket.current.on("user-joined", async (id) => {
      console.log("user joined client: ", id);
      toast.success(`User-joined = ${id}`);
      remoteSocketId.current = id;
      setRemoteId(id); // trigger useEffect
      
      /*if (localPeer.current) {
        await createOffer(id);
      } else {
        console.warn("Tried to create offer before peer was ready");
      }*/
    });

    /*remotePeer.current.on("connect", () => {
      console.log("connected my ID: ", remotePeer.current.id);
      setmyId(remotePeer.current.id);
      //socket.current.emit("join");
    });

   
    remotePeer.current.on("user-joined", async (id) => {
      console.log("user joined: ", id);
      remoteSocketId.current = id; 
      if (remotePeer.current) {
        await createOffer(id);
      } else {
        console.warn("Tried to create offer before peer was ready");
      }
    });*/

    socket.current.on("offer", async ({ sdp, caller }) => {
      console.log("Received offer from", caller);
      remoteSocketId.current = caller;
      await createAnswer(sdp, caller);
    });

    socket.current.on("answer", async ({ sdp }) => {
      console.log("Received answer");
      await localPeer.current.setRemoteDescription(
        new RTCSessionDescription(sdp)
      );
      for (const candidate of pendingCandidates.current) {
    try {
      await localPeer.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Error applying queued ICE candidate", err);
    }
  }
    pendingCandidates.current = [];
    });

    socket.current.on("ice-candidate", async ({ candidate }) => {
      if (localPeer.current) {
    try {
      await localPeer.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Error adding ICE candidate", error);
    }
  } else {
    // PeerConnection not ready yet, queue the candidate
    pendingCandidates.current.push(candidate);
  }
    });

    socket.current.on("user-disconnected", (id) => {
      console.log("User disconnected:", id);
      toast.info(`User left = ${id}`)
    });

    
  }, []);

  const startCall = async () => {
    setstartVideo(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true,audio:true});
      if (localvideoRef.current) {
        localvideoRef.current.srcObject = stream;
        
      }
      localstream.current=stream;
      setstartVideo(true);

      const configuration = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      };

      localPeer.current = new RTCPeerConnection(configuration);
      if(localPeer.current){
        console.log('localpeerid');
      }
      
      
      //remotePeer.current=new RTCPeerConnection(configuration);

      stream.getTracks().forEach((track) => {
        console.log('inontrack1');
        if(localPeer.current){
        console.log('localpeeridtrack');
        }
        localPeer.current.addTrack(track, stream);

        socket.current.emit("join",myId);
      });

      

      localPeer.current.ontrack = (event) => {
        console.log('inontrack2');
        console.log(remotevideoRef);
        remotevideoRef.current.srcObject = event.streams[0];
      };

      //ice candidate exchange
      localPeer.current.onicecandidate = (event) => {
        if (event.candidate && remoteSocketId.current) {
          socket.current.emit("ice-candidate", {
            target: remoteSocketId.current,
            candidate: event.candidate,
          });
        }
      };
        
        const callStartTime = new Date().toISOString();
    localStorage.setItem("callStartTime", callStartTime); // temporarily store for end tracking

    /*await axios.post(`${BASE_URL}/api/calllog/log`, {
      caller: username,
      reciever: remoteSocketId.current || "waiting...",
      startTime: callStartTime,
      endTime: null,
      status: "ongoing",
    });*/

    //console.log("Call log saved at start.");
    } catch (error) {
      console.log("error accessing camera ", error);
      //console.log("Error accessing camera or saving call log", error);
    }
  };  //startcallend

  const endCall = async () => {
    const callStartTime = localStorage.getItem("callStartTime");

    /*try {
      await axios.post(`${BASE_URL}/api/calllog/log`, {
        caller: username,
        reciever: remoteSocketId.current || "unknown",
        startTime: callStartTime,
        endTime: new Date().toISOString(),
        status: "ended",
      });

      console.log("Call log updated on end.");
    } catch (err) {
      console.error("Error ending call:", err);
    }*/

    if (localstream.current) {
      localstream.current.getTracks().forEach((track) => track.stop());
    }
  }; //end call

  useEffect(() => {
    console.log('useeffect end');
  const handleBeforeUnload = async () => {
    await endCall();  
  };

  // Listen for tab close or reload
  window.addEventListener("beforeunload", handleBeforeUnload);

  //  listen for route change or component unmount
  return () => {
    console.log('return end');
    window.removeEventListener("beforeunload", handleBeforeUnload);
    endCall(); // Also call it on component unmount
  };
}, []);

  const toggleMute=()=>{
    const audioTrack=localstream.current?.getAudioTracks()[0];
    if(audioTrack){
      audioTrack.enabled=!audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleCamera=()=>{
    const videoTrack=localstream.current?.getVideoTracks()[0];
    if(videoTrack){
      videoTrack.enabled=!videoTrack.enabled;
      setcameraOff(!videoTrack.enabled);
    }
  };

  /*const createOffer = async (targetId) => {
    const offer = await localPeer.current.createOffer();
    await localPeer.current.setLocalDescription(offer);
    socket.current.emit("offer", {
      sdp: offer,
      target: targetId,
    });
  };*/

  useEffect(() => {
  const createOffer = async () => {
    if(localPeer.current)
      console.log("offer in current");
    else
      console.log("offer nocurrent");

    if (!localPeer.current || !remoteId) return;

    try {
      const offer = await localPeer.current.createOffer();
      await localPeer.current.setLocalDescription(offer);
      socket.current.emit("offer", {
        sdp: offer,
        target: remoteId,
      });
    } catch (error) {
      console.log("Error creating offer", error);
    }
  };

  if (remoteId) {
    createOffer();
  }
}, [remoteId]);


  const createAnswer = async (offer, callerId) => {
    console.log('in createAnswer');
    await localPeer.current.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    console.log('after setRemoteDescription');
    const answer = await localPeer.current.createAnswer();
    await localPeer.current.setLocalDescription(answer);
    socket.current.emit("answer", {
      sdp: answer,
      target: callerId,
    });
    for (const candidate of pendingCandidates.current) {
    try {
      await localPeer.current.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Error applying queued ICE candidate", err);
    }
  }
  pendingCandidates.current = [];
  };
  


  /*useEffect(() => {
  console.log(`remoteid: `+remoteSocketId.current)
  //console.log('localid: '+localPeer.current)
  if (remoteSocketId.current ) {
    console.log('entered 1')
    createOffer();
  }
}, [remoteSocketId.current]);*/

  return (
    <div className={`vid ${showChat ? "chat-open with-chat" : "no-chat"}`}>
      <div className="action-buttons">
  {!startVideo && (
    <button className="startcall" onClick={startCall}>
      Start Call
    </button>
  )}
  {!showChat && (
    <button className="startchat" onClick={() => setshowChat(true)}>
      Start Chat
    </button>
  )}
</div>
      

      {startVideo && (
        <>
          
          <div className="video-container">
            <div className={`videoBox ${showChat ? "with-chat" : "no-chat"}`}>
              <div>
                <h4>{username ? `${username}`:'your video'}</h4>
                <video
                  className="video"
                  ref={localvideoRef}
                  autoPlay
                  playsInline
                ></video>
                <div className="controls">
              <button onClick={toggleMute}>
                {isMuted ? <CiMicrophoneOn />  : <CiMicrophoneOff />}
              </button>
              <button onClick={toggleCamera}>
                {cameraOff ? <IoVideocamOutline /> : <IoVideocamOffOutline />}
              </button>
            </div>
              </div>
              <div>
                <h4>Peer video</h4>
                <video
                  className="video"
                  ref={remotevideoRef}
                  autoPlay
                  playsInline
                ></video>
                
              </div>
            </div>
            
          </div>
        </>
      )}
      <Chat
        className="chatBox"
        showChat={showChat}
        toggleChat={()=> setshowChat((prev)=>!prev)}
        socket={socket.current}
        remoteSocketId={remoteSocketId}
        myId={socket.current?.id}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Video;
