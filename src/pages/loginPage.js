import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { putLogin, getMatchCode, getChainId, postTempuserTable } from "../api";
import { CreateChainId } from "../components/createChainId";
import { SHA256 } from "../utilityUnits/SHA256";

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
    const hPass = SHA256(inputPass);
    const record = {
      playerId: inputId,
      playerPass: hPass
    };
    const result = await putLogin(record);
    if(result){
      sessionStorage.setItem('userid', inputId);

      getChainId(inputId).then(chainId => {
        if(chainId !== null)
          sessionStorage.setItem('chainid', chainId);
        triger(true);
        navigate("/");
        window.location.reload();
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
        <br/><br/><a style={{cursor: "not-allowed"}}><p>주의: 잊어버린 Private Key는 되찾을 수 없습니다.</p></a>
        <br/>
        <a className="App-link" href="https://millrnft.com/userregist">CREATE ACCOUNT</a>
    </section>
  )
}

export const RegistInput = ({web3}) => {
  const [inputId, setId] = useState();
  const [inputVerif, setCode] = useState();
  const [inputConfirm, setConfirm] = useState();
  const [vcFlag, setVcFlag] = useState(false);
  const [sendFlag, setSFlag] = useState(false);
  
  const sendVcode = () => {
    postTempuserTable({playerId: inputId});
    setSFlag(true);
  }
  const verifBtn = async() => {
    const matchResult = await getMatchCode(inputId, inputVerif);
    console.log(matchResult);
    setVcFlag(matchResult);
    if(matchResult)
      alert('인증되었습니다');
    else
      alert('잘못된 요청코드입니다 코드를 다시 확인하여 주십시오');
  }

  return(
    <section>
        <h4>Email: <input placeholder='id' onChange={(evt)=>setId(evt.target.value)}/>
        <button onClick={sendVcode}>인증번호 전송</button></h4>
        {sendFlag ? <p>인증번호가 메일주소 {inputId} 로 전송되었습니다.</p>:<></>}
        <h4>인증번호: <input placeholder='verif' onChange={(evt)=>setCode(evt.target.value)}/>
        <button onClick={verifBtn}>인증하기</button></h4>   
        {vcFlag ? <>
          <CreateChainId uid={inputId} web3={web3}/>
        </>:<>
        </>}
    </section>
  )
}