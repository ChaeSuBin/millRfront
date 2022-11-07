import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postUploadItemIdx, getUserId } from '../api';
import { eventCreateItem, setNFTidx } from '../utilityUnits/connMintService';

export const MintItemCpnt = ({title, desc, toknUri, rightInfo}) => {
  const SEND_ADDR = sessionStorage.getItem('chainid');
  const navigate = useNavigate();
  const [NumOfTokn, setNumOfTokn] = useState();
  const [price, setValue] = useState();
  const [PRIVATE_KEY, setPrivKey] = useState(null);
  const [modalFlag, setFlag] = useState(false);
  const [Royalty, setLowest] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    exclusiveParsing();
    itemCreateEvtListener();
  },[toknUri, rightInfo])

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
            uploadItemIdx();
            alert('🎉Successfully Created');
            navigate("/");
          }
          else
            alert(`⚠️Err: ${result}`);
        })
      }
    else
      alert('Please enter the title and description of the item to be uploaded'); 
  }
  const uploadItemIdx = async() => {
    const userId = await getUserId(SEND_ADDR);
    const record = {
      title: title,
      desc: desc,
      hash: toknUri,
      userId: userId
    }
    postUploadItemIdx(record).then(response => {
      console.log(response);
    })
  }
  const inputDataConfirm = async() => {
    const royality = parseInt(Royalty*100000)+'0000000000000';
    const tokenUri = rightInfo+toknUri;
    console.log(royality, tokenUri, SEND_ADDR, price, NumOfTokn);
    setFlag(true);
  }
  const itemCreateEvtListener = async() => {
    const listen = await eventCreateItem(SEND_ADDR);
    console.log(listen);
  }
  return(
    <>
    {/* <button onClick={putDBtoknIDX}>temp</button> */}
    <h4>mintItem.js</h4>
    <h5>quantity: <input placeholder='quantity of token' onChange={(evt)=>setNumOfTokn(evt.target.value)} disabled={active}/></h5>
    <h5>price: <input placeholder='price of token' onChange={(evt)=>setValue(evt.target.value)} /></h5>
    <h5>royalties: <input placeholder='MATIC' onChange={(evt)=>setLowest(evt.target.value)}/></h5>
    <h5>private Key: <input placeholder='input your private key to mint nft' onChange={(evt)=>setPrivKey(evt.target.value)} size='45'/></h5>
    <button onClick={inputDataConfirm}>판매시작</button>
    <AlertModal 
      showFlag={modalFlag}
      NofTokn={NumOfTokn}
      price= {price}
      setFlag={setFlag}
      startSale={setItem}
    />
    </>
  )
}

const AlertModal = ({showFlag, setFlag, NofTokn, price, startSale}) => {
  return(
    <>{showFlag ? ( // showFlagがtrueだったらModalを表示する
      <div id="overlay" className='overlay'>
        <div id="modalcontents" className="modalcontents">
        <h4>판매 확인.</h4>
          판매수량: {NofTokn}<br/>
          판매가격: {price}<br/><br/>
          *(이 작업은 가스비가 소모됩니다)<br/>
        <button onClick={()=>setFlag(false)}>cancel</button>
        <button onClick={startSale}>confirm</button>
        </div>
      </div>
      ) : (
        <></>// showFlagがfalseの場合はModalは表示しない)
      )}
    </>
  )
}