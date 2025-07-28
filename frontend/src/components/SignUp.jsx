import React,{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import axios from'axios';

const SignUp = () => {

  const [formusername,setformUsername]=useState('');
  const[password,setpassword]=useState('');
  const[confirmpassword,setconfirmpassword]=useState('');
  const navigate=useNavigate();
  const BASE_URL = 'https://vid-meet-backend.onrender.com';
  
  const handlesignup=async(e)=>{

    e.preventDefault();

    if(!formusername || !password || !confirmpassword){
      alert('Please fill all fields');
      return;
    }
    if(password !==confirmpassword){
      alert('Passwords do not match');
      return;
    }
    try {
      const res=await axios.post(`${BASE_URL}/api/users/register`,{
        username:formusername,
        password,
      });
      console.log('SignUp scuccess:',res.data);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error.response?.data?.message || error.message);
      alert(error.response?.data?.message || 'Signup failed. Try a different username.');
    }
    

  }
  
  return (
    <div className="signup-container">
      <h2>SignUp</h2>
      <form onSubmit={handlesignup} className="signup-form">
        <input 
        type="text" 
        placeholder="Username"
        value={formusername}
        onChange={(e)=> setformUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmpassword}
          onChange={(e) => setconfirmpassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
    </div>
  )
}

export default SignUp
