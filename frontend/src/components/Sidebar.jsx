import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import { IoAppsOutline } from "react-icons/io5";
import { MdOutlineManageAccounts } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { MdOutlineSettingsSuggest } from "react-icons/md";
import './style.css';
import { FaCircleArrowLeft } from "react-icons/fa6";

const Sidebar = () => {

  const [isOpen,setIsOpen]=useState('');
  const toggleSideBar = ()=> setIsOpen(!isOpen)
  const closeSidebar=()=>setIsOpen(false);


  return (
    <div>
      {!isOpen && (
        <button className="sidebar-toggle" onClick={toggleSideBar}>
          <IoAppsOutline />
        </button>
      )}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h2 className="sidebar-title">
          Personalization
        </h2>
        <ul>
          <li><Link to="/profile" className='sidebar-link'><VscAccount /> Profile</Link></li>
          <li><Link to="/account" className='sidebar-link'><MdOutlineManageAccounts /> Account</Link></li>
          <li><Link to="/settings" className='sidebar-link'><MdOutlineSettingsSuggest /> Settings</Link></li>
        </ul>
        <button className='close-sidebar' onClick={closeSidebar}><FaCircleArrowLeft /></button>
      </div>
    </div>
  )
}

export default Sidebar
