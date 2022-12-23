import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUploadItemIdx, getUserId, putLogin } from '../../api';
import { eventCreateItem, setNFTidx } from '../../utilityUnits/connMintService';
import { SHA256 } from '../../utilityUnits/SHA256';
import { WaitModal } from '../waitModal';
import { Help } from '../helpCpnt';

export const SetItemCpnt = ({title, desc, toknUri, rightInfo}) => {
  const SEND_ADDR = sessionStorage.getItem('chainid');
  const navigate = useNavigate();
  const [NumOfTokn, setNumOfTokn] = useState();
  const [price, setValue] = useState();
  const [PRIVATE_KEY, setPrivKey] = useState(null);
  const [modalFlag, setFlag] = useState(false);
  const [Royalty, setLowest] = useState(0);
  const [donate, setDonate] = useState();
  const [active, setActive] = useState(false);
  const [helpFlag, setHelp] = useState(false);
  const [helpMode, setHmode] = useState();

  const exclusiveParsing = () => {
    let result = rightInfo.split('/');
    //console.log(result[1]);
    if(result[1] === 'Exclusive'){
      setActive(true);
      setNumOfTokn(1);
    }
    else
      setActive(false);
  }

  const setItem = async() => {
    const royality = parseInt(Royalty*100000)+'0000000000000';
    const value = parseInt(price*100000)+'0000000000000';
    const tokenUri = rightInfo+toknUri;
    
    if(title !== '' && desc !== '' && price !== undefined && NumOfTokn !== undefined){
      const record = {
        playerId: sessionStorage.getItem('userid'),
        playerPass: SHA256(PRIVATE_KEY)
      }
      if(await putLogin(record)){
        setNFTidx(SEND_ADDR, PRIVATE_KEY, tokenUri, value, royality, NumOfTokn).then(result => {
          if(result === true){
            console.log(10000);
            uploadItemIdx();
          }
          else{
            alert('폴리곤 네트워크에 정보를 쓰기위한 수수료(gas)가 부족합니다\n계좌의 폴리곤 코인을 충전 후 다시 시도하여 주십시오.');
            setFlag(false);
          }
        })
      }
      else{
        alert('Private Key 를 다시 확인 후 시도하십시오');
        setFlag(false);}
    }
    else{
      setFlag(false);
      alert('아이템 정보, 발행 정보를 정확히 입력한 후 다시 시도하십시오');
    }
  }
  const uploadItemIdx = async(_itemId) => {
    const userId = await getUserId(SEND_ADDR);
    const record = {
      //itemId: parseInt(_itemId),
      title: title,
      desc: desc,
      hash: toknUri,
      userId: userId,
      fromAddr: SEND_ADDR,
      tempdonate: donate,
    }
    postUploadItemIdx(record).then(response => {
      console.log('checka')
      if(response){
        setFlag(false);
        alert('🎉Successfully Created');
        navigate("/");
      }
    })
  }
  // const itemCreateEvtListener = async() => {
  //   eventCreateItem(SEND_ADDR).then(listen => {
  //     if(listen){
  //       uploadItemIdx(listen.itemId);
  //     }
  //   }).catch(err => {
  //     console.log(err);
  //   })
  // }
  const openHelp = (evt, _displayMode) => {
    setHelp(true);
    setHmode(_displayMode);
    document.addEventListener('click',closeModal);
    evt.stopPropagation();
  }
  const closeModal = () => {
    setHelp(false);
    document.removeEventListener('click',closeModal);
  }
  return(
    <>
    {/* <button onClick={putDBtoknIDX}>temp</button> */}
    <h3>아이템 판매정보 입력</h3>
    <p>하기란은 스마트컨트랙트에 의해 보장되며 이후 수정이 불가합니다.</p>
    <p>발행수량: <input type="number" placeholder='quantity of token' onChange={(evt)=>setNumOfTokn(evt.target.value)} disabled={active}/><a onClick={(evt) => openHelp(evt, 4)} style={{cursor: "help"}}>❓</a></p>
    <p>발행가격: <input type="number" step="0.01" placeholder='price of token' onChange={(evt)=>setValue(evt.target.value)} /><a onClick={(evt) => openHelp(evt, 5)} style={{cursor: "help"}}>❓</a></p>
    <p>로열티: <input type="number" placeholder='MATIC' onChange={(evt)=>setLowest(evt.target.value)} defaultValue='0'/><a onClick={(evt) => openHelp(evt, 1)} style={{cursor: "help"}}>❓</a></p>
    <p>기부처: <input placeholder='Organization' onChange={(evt)=>setDonate(evt.target.value)} /><a onClick={(evt) => openHelp(evt, 6)} style={{cursor: "help"}}>❓</a></p>
    <p>private Key: <input placeholder='input your private key to mint nft' onChange={(evt)=>setPrivKey(evt.target.value)} size='45'/></p>
    <button onClick={() => {setFlag(true); setItem();}}>판매시작</button>
    <WaitModal showFlag={modalFlag} />
    <Help
      showFlag={helpFlag}
      display={helpMode}
    />
    </>
  )
}
// const stopTimer = () => {
//   clearInterval(intervalId);
//   intervalId=null;
//   count = 0;
// }