import React, { useState } from 'react';
import './App.css';
import Video from './components/Video';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route,Link } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Sidebar from './components/Sidebar';
import History from './components/History';

export const App = () => {
  const[username,setUsername]=useState('');

  return (
    <Router>

     <div className='home'>
      <nav className='navbar'>
        <div className="logo">Vid-Meet</div>
        <div className="nav-links">
          <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/history">History</Link>
            
        </div>
      </nav>
      <Sidebar/>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login setUsername={setUsername}/>}/>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/video" element={<Video username={username}/>} />
         <Route path="/history" element={<History />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />

     </div>
    </Router>
  )
}


export default App