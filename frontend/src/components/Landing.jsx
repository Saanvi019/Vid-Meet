import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; //It lets you programmatically change routes 
import './style.css';
import Lottie from 'lottie-react';
import videoChatAnimation from '../assets/video-chat.json';


const Landing=()=>{

  const navigate=useNavigate();

  return(
    <div className='landing-container'>
      <div className='landing-left'>
        <h1>Welcome to vid-Meet</h1>
        <div className="landing-buttons">
          <button onClick={()=>navigate('/login')} className="silo button">Login</button>
          <p>Don't have an account?</p>
          <button onClick={()=>navigate('/signup')} className="silo button">Sign Up</button>
        </div>
      </div>
      <div className='landing-right'>
        <Lottie animationData={videoChatAnimation} loop={true} />
      </div>
    </div>
  )




};
export default Landing;