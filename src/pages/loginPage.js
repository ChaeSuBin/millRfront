import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { postUserRegi, putLogin, getChainId, postTempuserTable } from "../api";

export const LoginInput = ({triger}) => {
  const navigate = useNavigate();
  const [inputId, setId] = useState();
  const [inputPass, setPass] = useState();
  const [findMode, setFlag] = useState(false);
  const [inputVc, setVc] = useState();
  
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
  return(
    <section>
      <h2>login</h2>
      <h5>Email: <input onChange={(event) => setId(event.target.value)} name="id" placeholder='id'/></h5>
      <h5>pass: <input  onKeyPress={keyPress} type='password' 
        onChange={(event) => setPass(event.target.value)} name="pw" placeholder='password'/></h5>
      <button onClick={submit}>login</button>
      <p onClick={() => setFlag(true)}>forgot your password?</p>
      {findMode ? <>
        <h5>E-mail: <input onChange={(event) => setId(event.target.value)} name="id" placeholder='id'/></h5>
        <button>send verification code</button>
        <h5>verification code: <input onChange={(evt) => setVc(evt.target.value)} name="vc" placeholder='code'/></h5>
      </>:<></>}
      <br/><br/>
      <a className="App-link" href="http://mintservice.asuscomm.com:3000/userregist">CREATE ACCOUNT</a>
    </section>
  )
}

export const RegistInput = () => {
  const navigate = useNavigate();
  const [inputId, setId] = useState();
  const [inputPass, setPass] = useState();
  const [inputConfirm, setConfirm] = useState();
  const [vcFlag, setVcFlag] = useState(false);
  
  const registPlayer = () => {
    const record = {
      playerId: inputId,
      playerPass: inputPass,
    }
    postUserRegi(record).then(result => {
      if(result){
        alert('🎉 Account creation completed');
        navigate('/signinpage');
      }
      else
        alert('err 600');
    })
  }
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