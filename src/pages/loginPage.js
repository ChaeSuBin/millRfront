import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { putLogin, getChainId, postTempuserTable, postResetMail, postResetPass } from "../api";

export const LoginInput = ({triger}) => {
  const navigate = useNavigate();
  const [inputId, setId] = useState();
  const [inputPass, setPass] = useState();
  const [inputPassConfirm, setConfirm] = useState();
  const [findMode, setFlag] = useState(false);
  const [inputVc, setVc] = useState(null);
  
  const keyPress = (evt) => {
    if(evt.key === 'Enter') submit();
  }
  const submit = async() => {
    const record = {
      playerId: inputId,
      playerPass: inputPass
    };
    const result = await putLogin(record);
    if(result){
      sessionStorage.setItem('userid', inputId);

      getChainId(inputId).then(chainId => {
        if(chainId !== null)
          sessionStorage.setItem('chainid', chainId);
        triger(true);
        navigate("/");
      })
    }
    else{
      alert('❗confirm your ID and PASS again');
    }
  }
  const sendMail = () => {
    postResetMail({playerId: inputId}).then(result => {
      if(result)
        alert('인증메일 전송됨.');
    })
  }
  const changePass = () => {
    if(inputPass !== inputPassConfirm){
      alert('Passwords not match each other');
    }
    else if(inputVc == null || inputVc == undefined){
      alert('not entered verification code');
    }
    else{
      const record = {
        playerId: inputId,
        playerPass: inputPass,
        vCode: inputVc
      }
      postResetPass(record).then(result => {
        if(result){
          alert('Password has been changed Please log in again.');
          setFlag(false);}
        else
          alert('check again verification code');
      })
    }
  }
  return(
    <section>
      {findMode ? <>
        <h5>E-mail: <input onChange={(event) => setId(event.target.value)} name="id" placeholder='id'/></h5>
        <button onClick={sendMail}>send verification code</button>
        <h5>verification code: <input onChange={(evt) => setVc(evt.target.value)} name="vc" placeholder='code'/></h5>
        <h5>new Password: <input onChange={(evt) => setPass(evt.target.value)} name="newpw" type='password'/></h5>
        <h5>confirm Password: <input onChange={(evt) => setConfirm(evt.target.value)} type='password'/></h5>
        <button onClick={changePass}>change Password</button>
                
      </>:<>
        <h2>login</h2>
        <h5>Email: <input onChange={(event) => setId(event.target.value)} name="id" placeholder='id'/></h5>
        <h5>pass: <input  onKeyPress={keyPress} type='password' 
          onChange={(event) => setPass(event.target.value)} name="pw" placeholder='password'/></h5>
        <button onClick={submit}>login</button>
        <br/><br/><a style={{cursor: "pointer"}}><p onClick={() => setFlag(true)}>forgot your password?</p></a>
        <br/>
        <a className="App-link" href="http://mintservice.asuscomm.com:3000/userregist">CREATE ACCOUNT</a>
      </>}
      
    </section>
  )
}

export const RegistInput = () => {
  const [inputId, setId] = useState();
  const [inputPass, setPass] = useState();
  const [inputConfirm, setConfirm] = useState();
  const [vcFlag, setVcFlag] = useState(false);
  
  const doneBtn = () => {
    if(inputPass === inputConfirm){
      const record = {
        playerId: inputId,
        playerPass: inputPass,
      }
      setVcFlag(true);
      postTempuserTable(record);
    }
    else
      alert('password not match! check again your password');
  }
  return(
    <section>
      {vcFlag ? <>
        <p>입력하신 email 주소 {inputId} 로 인증 URL을 전송하였습니다<br/>
        해당 주소로 접속하여 계정생성을 완료하십시오.</p>
      </>:<>
        <h5>Email: <input placeholder='id' onChange={(evt)=>setId(evt.target.value)}/></h5>
        <h5>pass: <input type='password' placeholder='password' onChange={(evt)=>setPass(evt.target.value)}/></h5>
        <h5>password confirm <input type='password' placeholder="password" onChange={(evt)=>setConfirm(evt.target.value)}/></h5>
        <button onClick={doneBtn}>submit</button>
      </>}
    </section>
  )
}