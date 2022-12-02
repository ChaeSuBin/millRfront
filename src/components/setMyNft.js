import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { getItemsIdList, getOwnedItems, getOwnedTokns, getUserId, putLogin, putToknSale } from '../api';
import { ListItemsModal, ListItemsCpnt } from './itemCpnt';
import { 
  getItemStatus,
  getApproveState,
  setApprovalAll,
  openToken,
  closeToken
} from "../utilityUnits/connMintService";
import { SHA256 } from '../utilityUnits/SHA256';

export const SetMyNFT = ({chainId}) => {
  
  const [toknId, settoknId] = useState([]);
  const [toknStatus, setToknStt] = useState();
  const [toknMatch, setToknMatch] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [modalFlag, setFlag] = useState(false);

  useEffect(()=>{
    itemListViewer();
    toknListViewer();
  },[])

  const itemListViewer = async() => {
    const userId = await getUserId(chainId);
    const items = await getOwnedItems(userId);
    setItemList(items);
  }
  const toknListViewer = async() => {
    let itemInfoArr = [{title: null, desc: null}];

    const userId = await getUserId(chainId);
    const item = await getOwnedTokns(userId);
    console.log(item);
    let itemLen = 0;
    while(itemLen < item[0].length){
      itemInfoArr[itemLen] = {
        title: item[0][itemLen].title, 
        desc: item[0][itemLen].description, 
        toknId: item[1][itemLen].toknid
      };  
      ++itemLen;
    }
    console.log(itemInfoArr);
    if(item[0].length > 0)
      setToknMatch(itemInfoArr);
  }

  const getToknStatus = async(_toknId) => {
    const toknStatus = await getItemStatus(_toknId);
    let count = 0;
    //console.log(typeof toknStatus[0]);
    do{
      toknStatus[0] /= 100;
      ++count;
    }while(count < 9)
    
    if(toknStatus[0] != 0)
      return `${toknStatus[0]} MATIC`;
    else
      return 'not for sale';
  }
  return(
    <>
      <h2>업로드한 아이템 목록.</h2>
      {itemList.length === 0 ? 
        <p>There are no items uploaded yet</p>:<></>}
      {itemList.map((searchItems, index) => (
        <ListItemsCpnt
          key={index}
          title={searchItems.title}
          desc={searchItems.description}
          itemId = {searchItems.id}
        />
      ))}
      <h2>보유한 NFT 목록.</h2>
      {toknMatch.length === 0 ?
        <p>No NFT in your account</p>:<></>}
      {toknMatch.map((searchItems, index) => (
        <ListItemsModal
          key={index}
          title={searchItems.title}
          desc={searchItems.desc}
          toknId={searchItems.toknId}
          setToknId={(id) => settoknId(id)}
          setToknStt={(stt) => setToknStt(stt)}
          flag={(tru)=>setFlag(tru)}
        />
      ))}
      <SaleModal
        showFlag={modalFlag}
        setFlagFunc={setFlag}
        selectedId={toknId}
        toknState = {toknStatus}
        ADDR = {chainId}
      />
    </>
  )
}

const SaleModal = ({showFlag, setFlagFunc, selectedId, toknState, ADDR}) => {
  const [PRIVATE_KEY, setPriv] = useState();
  const [toknPrice, setPrice] = useState();
  
  const startSale = async() => {
    const approveState = await getApproveState(ADDR);
    if(approveState){
      console.log('coz');
      openTokn();
    }
    else{
      const approve_result = await setApproval();
      if(approve_result === true){
        console.log('kpk');
        openTokn();}
      else
        alert(`No permissions granted.\n${approve_result}`);
    }
  }
  const openTokn = async() => {
    if(toknPrice !== undefined){
      const record = {
        playerId: sessionStorage.getItem('userid'),
        playerPass: SHA256(PRIVATE_KEY)
      }
      if(await putLogin(record)){
        const tokenPrice = parseInt(toknPrice*100000)+'0000000000000';
        openToken(ADDR, PRIVATE_KEY, tokenPrice, selectedId).then(result => {
          if(result === true){
            const recorde = {
              toknId: selectedId,
              price: toknPrice,
              state: true
            }
            putToknSale(recorde).then(resultIdx => {
              if(resultIdx){
                alert(`NFT (ID: ${selectedId}) sale started`);
                setFlagFunc(false);
              }
            })
          }
          else{
            console.log(result);
            alert('not enough gas');
          }
        })
      }
      else{
        alert('check again your Private key');
      }
    }
    else
      alert('please set a selling price');
  }
  const closeTokn = async() => {
    if(PRIVATE_KEY !== undefined){
      closeToken(ADDR, PRIVATE_KEY, selectedId).then(result => {
        if(result === true){
          const record = {
            toknId: selectedId,
            price: 0,
            state: false
          }
          putToknSale(record).then(resultIdx => {
            if(resultIdx){
              alert(`NFT (ID: ${selectedId}) closed`);
              setFlagFunc(false);
            }
          })
        }
        else{
          //console.log(result);
          alert(result);}
      })
    }
    else
      alert('!PRIVATE_KEY required');
  }
  const setApproval = () => {
    return new Promise(resolve => {
      if(window.confirm('Grant NFT transfer permission to below SmartContract\n0x1434F691eCefeA03ce6532a4cA99FD7E08764e2d')){
        setApprovalAll(ADDR, PRIVATE_KEY, true).then(result => {
          console.log(result);
          resolve(result);
        })
      }
      else{
        resolve(false);
      }
    })
  }
  const setApprovalFalse = async() => {
    setApprovalAll(ADDR, PRIVATE_KEY, false).then(result => {
      console.log(result);
    })
  }
  const temp = async() => {
    const approveState = await getApproveState(ADDR);
    console.log(approveState);
    console.log(toknState);
  }
  return(<>
    {showFlag ? ( // showFlagがtrueだったらModalを表示する
    <div id="overlay" className='overlay'>
      <div id="modalcontents" className="modalcontents">
        <button onClick={()=>setFlagFunc(false)}>close</button>
        <h4>NFT ID: {selectedId}</h4>
        <h5> PRIVATE_KEY :
          <input onChange={(evt)=>setPriv(evt.target.value)} size='45'></input></h5>
        <h5> price : 
          <input placeholder='price(MATIC)' onChange={(evt)=>setPrice(evt.target.value)} size='10'/></h5>
        <Link to={`/itemdetails/token/${selectedId}`} style={{ textDecoration: 'none' }}>
          click to check detail this NFT
        </Link><br/><br/>
        {toknState==='Open' ? 
          <button onClick={closeTokn}>close sale</button>:
          <button onClick={startSale}>sale start</button>
        }
        {/* <button onClick={setApprovalFalse}>setfalse</button>
        <button onClick={temp}>temp</button> */}
      </div>
    </div>
    ) : (
      <></>// showFlagがfalseの場合はModalは表示しない)
    )}
  </>)
}