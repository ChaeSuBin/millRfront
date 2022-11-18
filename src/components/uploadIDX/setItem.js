import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUploadItemIdx, getUserId } from '../../api';
import { eventCreateItem, setNFTidx } from '../../utilityUnits/connMintService';
import { WaitModal } from '../waitModal';

let count = 0;
let intervalId = null;

export const SetItemCpnt = ({title, desc, toknUri, rightInfo}) => {
  const SEND_ADDR = sessionStorage.getItem('chainid');
  const navigate = useNavigate();
  const [NumOfTokn, setNumOfTokn] = useState();
  const [price, setValue] = useState();
  const [PRIVATE_KEY, setPrivKey] = useState(null);
  const [modalFlag, setFlag] = useState(false);
  const [Royalty, setLowest] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    itemCreateEvtListener();
  },[])

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
    //const saveItemIdx = await uploadItemIdx();
    if(title !== '' && desc !== '' ){
      setNFTidx(SEND_ADDR, PRIVATE_KEY, tokenUri, value, royality, NumOfTokn).then(
        result => {
          if(result === true){
            intervalId = setInterval(() => {
              if(count > 9){
                stopTimer();
                setFlag(false);
                alert('입력하신 Private Key가 다른 주소의 키 같습니다\n 키를 확인 후 다시 시도하여주십시오.')
              }
              else
                ++count;
            }, 1000);
          }
          else{
            setFlag(false);
            alert(`⚠️Err: ${result}`);
          }
        })
      }
    else{
      setFlag(false);
      alert('Please enter the title and description of the item to be uploaded');
    }
  }
  const uploadItemIdx = async(_itemId) => {
    const userId = await getUserId(SEND_ADDR);
    const record = {
      itemId: parseInt(_itemId),
      title: title,
      desc: desc,
      hash: toknUri,
      userId: userId
    }
    postUploadItemIdx(record).then(response => {
      console.log('checka')
      if(response){
        setFlag(false);
        stopTimer();
        alert('🎉Successfully Created');
        navigate("/");
      }
    })
  }
  const itemCreateEvtListener = async() => {
    const listen = await eventCreateItem(SEND_ADDR);
    uploadItemIdx(listen.itemId);
  }
  return(
    <>
    {/* <button onClick={putDBtoknIDX}>temp</button> */}
    <h3>아이템 판매정보 입력</h3>
    <p>quantity: <input placeholder='quantity of token' onChange={(evt)=>setNumOfTokn(evt.target.value)} disabled={active}/></p>
    <p>price: <input placeholder='price of token' onChange={(evt)=>setValue(evt.target.value)} /></p>
    <p>royalties: <input placeholder='MATIC' onChange={(evt)=>setLowest(evt.target.value)}/></p>
    <p>private Key: <input placeholder='input your private key to mint nft' onChange={(evt)=>setPrivKey(evt.target.value)} size='45'/></p>
    <button onClick={() => {setFlag(true); setItem();}}>판매시작</button>
    <WaitModal showFlag={modalFlag} />
    </>
  )
}
const stopTimer = () => {
  clearInterval(intervalId);
  intervalId=null;
  count = 0;
}