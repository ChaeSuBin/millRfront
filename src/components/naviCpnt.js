import '../App.css';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

export const Nav = ({userId, chainId}) => {
  const[logined, setLogined] = useState(false);
  
  useEffect(()=>{
    if(userId !== null)
      setLogined(true);
    else if(sessionStorage.getItem('userid') !== null)
      setLogined(true);
  },[userId])

  const storageClear = () => {
    sessionStorage.clear();
    window.location.reload();
  }
  return (
    <nav style={{fontSize: "large"}}>
      <Link to="/" className="space">home</Link>
      {logined ? 
        <>
          <a style={{cursor: "pointer"}} onClick={storageClear} className="space">signout</a>
          <Link to="/myinfo" className="space">Account Info</Link>
        </>:<Link to="/signinpage" className="space">
          signin
        </Link>
      }
      <Link to="/cooperlate" className="space">group</Link>
      <>. 재능</>
      <Link to="/donatetemp" className='space'>endowment</Link>
      <Link to='/helpdesk' className="space">help</Link>
      {/* {userId} : {chainId} */}
    </nav>
  );
}