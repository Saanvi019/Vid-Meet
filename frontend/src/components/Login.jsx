import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import './style.css';
import loginIllustration from '../assets/login-illustration.svg';
import axios from 'axios';


const Login = ({setUsername}) => {

  const[inputUsername,setInputusername]=useState('');
  const[password,setPassword]=useState('');
  const navigate=useNavigate();
  const BASE_URL = 'https://vid-meet-backend.onrender.com';

  const handleLogin=async(e)=>{
    e.preventDefault();//Prevents the default behavior of a form submission, which is reloading the page.
    if(inputUsername.trim()==='' || password.trim()===''){
      alert("Please enter both username and password");
      return;
    }

    try {
      const response=await axios.post(`${BASE_URL}/api/users/login`,{
        username:inputUsername,
        password:password
      })
      if (response.status === 200) {
        const { token, user } = response.data;

  
  localStorage.setItem('vidmeet-token', token);
  localStorage.setItem('vidmeet-user', user.username);

  setUsername(user.username); 
  alert("Login successful!");
  navigate('/video');
      }
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || error.message);
      alert(error.response?.data?.message || "Login failed. Try again.");
    }


    setUsername(inputUsername);
    navigate('/video');

  }


  return (
    <div className="login-container">
      
      <div></div>
      <h2>LogIn</h2>
      <form onSubmit={handleLogin} className='login-form'>
        <input 
        type="text" 
        placeholder="Enter your username"
        value={inputUsername}
        onChange={(e)=>setInputusername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Join</button>
      </form>
    </div>
  )
}

export default Login;
