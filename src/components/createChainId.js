import React from 'react';
import './modal.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChainId, putChainId } from '../api';

export const CreateChainId = ({uid, web3}) => {

  const [modalFlag, setModal] = useState(false);
  const [chainAccount, setAccount] = useState([]);

  const createAccount = async() => {
    const FROM_ADDR = await getChainId(uid);
    if(FROM_ADDR){
      let accountKey = [];
      const account = web3.eth.accounts.create();
      const record = { 
        playerId: uid,
        chainId : account.address
      }
      accountKey.push(account.address);
      accountKey.push(account.privateKey);
      setAccount(accountKey);
      console.log(accountKey);

      putChainId(record).then(result => {
        if(result){
          setModal(true);
        }
      })
    }
    else{
      alert('Please refresh this page in a few minutes');
    } 
  }
  return(
    <>
      <button onClick={createAccount}>create chainId</button>
      <AlertModal 
        showFlag={modalFlag} 
        ADDR={chainAccount[0]} 
        PRIVATE_KEY={chainAccount[1]} />
    </>
  )
}

const AlertModal = ({showFlag, ADDR, PRIVATE_KEY}) => {
  const navigate = useNavigate();
  const closeBtn = () => {
    sessionStorage.clear();
    navigate('/signinpage');
  }
  return(
    <>{showFlag ? ( // showFlagがtrueだったらModalを表示する
      <div id="overlay" className='overlay'>
        <div id="modalcontents" className="modalcontents">
        <p>
          🎉Successfuly Created<br/>
          CHAIN ID: {ADDR}<br/>
          PRIVATE KEY: {PRIVATE_KEY}<br/>
          비밀키는 분실 시 되찾을 수 없습니다.<br/>
          반드시 메모장 등 자신만이 알 수 있는 곳에 옮겨 저장하십시오.<br/>
          비밀키는 절대로 타인에게 알려주지 마십시오.<br/>
          *재로그인 후 적용됩니다.
        </p>
        <button onClick={closeBtn}>confirm</button>
        </div>
      </div>
      ) : (
        <></>// showFlagがfalseの場合はModalは表示しない)
      )}
    </>
  )
}