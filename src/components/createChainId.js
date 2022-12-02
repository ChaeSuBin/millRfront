import React from 'react';
import './modal.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postRegiPlayer } from '../api';
import { SHA256 } from '../utilityUnits/SHA256';

export const CreateChainId = ({uid, web3}) => {
  const navigate = useNavigate();
  const [showFlag, setFlag] = useState(false);
  const [chainAccount, setAccount] = useState([]);
  const [priv, setPriv] = useState();

  const createAccount = async() => {
    let accountKey = [];
    const account = web3.eth.accounts.create();
    
    accountKey.push(account.address);
    accountKey.push(account.privateKey);
    setAccount(accountKey);
    
    setFlag(true);
  }
  const doneBtn = () => {
    if(chainAccount[1] === priv){
      const hPass = SHA256(chainAccount[1]);
      const record = {
        userId: uid,
        pass: hPass,
        addr: chainAccount[0]
      }
      postRegiPlayer(record).then(result => {
        if(result === true){
          alert('복사한 비밀키는 잊어버리지 않도록 다른곳에 반드시 저장하십시오');
          sessionStorage.clear();
          navigate('/signinpage');
        }
      })
    }
    else
      alert('PRIVATE KEY 를 정확히 입력하여 주십시오');
  }
  return(
    <>
      {showFlag ? <>
        <p>
          🎉Successfuly Created<br/>
          CHAIN ID: {chainAccount[0]}<br/><br/>
          PRIVATE KEY: {chainAccount[1]}<br/><br/>
          비밀키는 분실 시 되찾을 수 없습니다.<br/>
          반드시 메모장 등 자신만이 알 수 있는 곳에 옮겨 저장하십시오.<br/>
          비밀키는 절대로 타인에게 알려주지 마십시오.<br/><br/>
          위의 비밀키를 아래의 입력창에 붙여넣어 계정생성을 완료하세요
        </p>
        <input placeholder='PRIVATE_KET' onChange={(evt)=>setPriv(evt.target.value)}/>
        <button onClick={doneBtn}>완료하기</button>
      </>:<>
        <button onClick={createAccount}>계정 만들기</button>
      </>}
    </>
  )
}