import React, { useEffect, useState }from 'react';
import { useParams } from "react-router-dom";
import { getItemFiles, getItemInfo, getItemInfoFromToknId } from '../components/detailPages/setItemIDX';
import { FileListViewer } from'../components/detailPages/fileListViewer';
import { getBlockInfo, getNftInfo } from '../components/detailPages/setBlockIDX';
import { WaitModal } from '../components/waitModal';
import { buyToknMint } from '../components/detailPages/toknMint';
import { buyToknTransfer } from '../components/detailPages/toknTransfer';
import { Help } from '../components/helpCpnt';

export const  ItemDetail = () => {
  const FROM_ADDR = sessionStorage.getItem('chainid');
  const locate = useParams();
  const [itemInfo, setII] = useState({title: '', desc: ''});
  const [itemInfoB, setIB] = useState({price: null, royalty: null, useRange: null, remain: null });
  const [fileList, setFlist] = useState([]);
  const [buyMode, setMode] = useState(false);
  const [buyFlag, setFlag] = useState(false);
  const [waitFlag, set_w_Flag] = useState(false);
  const [helpFlag, setHelp] = useState(false);
  const [helpMode, setHmode] = useState();
  
  useEffect(() => {
    currentMode(locate.id, locate.mode);
  },[])

  const currentMode = (_rowId, _mode) => {
    if(_mode === 'item')
      modeIgetInfo(_rowId);
    else
      modeTgetInfo(_rowId) //not rowId -> toknId
  }
  const modeIgetInfo = async(_rowId) => {
    const itemInfo = await getItemInfo(_rowId);
    setII(itemInfo);
    const fileList = await getItemFiles(itemInfo.hash);
    setFlist(fileList);
    const itemInfoB = await getBlockInfo(itemInfo.itemId);
    setIB(itemInfoB);
  }
  const modeTgetInfo = async(_toknId) => {
    setMode(true);
    const toknInfo = await getNftInfo(_toknId);
    setIB(toknInfo);
    const fileList = await getItemFiles(toknInfo.fileHash);
    setFlist(fileList);
    const itemInfo = await getItemInfoFromToknId(_toknId);
    setII(itemInfo);
  }
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
  return (
  <><br/><br/>
    <h3>title: {itemInfo.title}</h3>
    <h4>가격: {itemInfoB.price} MATIC</h4>
    <h4 onClick={(evt) => openHelp(evt, 1)} style={{cursor: "help"}}>수수료: {itemInfoB.royalty} MATIC ?</h4>
    <h4 onClick={(evt) => openHelp(evt, 0)} style={{cursor: "help"}}>이용가능 범위: {itemInfoB.useRange} ?</h4>
    
    {buyMode ? 
      <>
        <h4>판매상태: {itemInfoB.door}</h4>
      </> : <>
        <h4>남은 수량: {itemInfoB.remain}개 남음</h4>  
      </>}
    <button onClick={() => setFlag(true)}>구매하기</button>
    {fileList.map((searchItems, index) => (
      <FileListViewer
        key={index}
        fileName={searchItems}
        toknUri = {itemInfo.hash}
        permission = {true}
      />
    ))}
    <BuyModal
      showFlag={buyFlag}
      setFlag = {setFlag}
      setFlag2 = {set_w_Flag}
      addr = {FROM_ADDR}
      price = {itemInfoB.price}
      itemId = {itemInfo.itemId}
      buyMode = {buyMode}
    />
    <WaitModal
      showFlag={waitFlag}
    />
    <Help
      showFlag={helpFlag}
      display={helpMode}
    />
  <br/><br/></>
  );
}
const BuyModal = ({showFlag, setFlag2, setFlag, addr, price, itemId, buyMode}) => {
  const [PRIVATE_KEY, setPriv] = useState();
  
  return(<>
    {showFlag ? ( // showFlagがtrueだったらModalを表示する
    <div id="overlay" className='overlay'>
      <div id="modalcontents" className="modalcontents">
        <h4>가격: {price} Matic</h4>
        <h5> PRIVATE_KEY :
          <input onChange={(evt)=>setPriv(evt.target.value)} size='45'></input></h5>
        {buyMode ? <button onClick={() => {setFlag2(true); buyToknTransfer(price, itemId, setFlag2, addr, PRIVATE_KEY)}}>구매하기</button> : 
          <button onClick={() => {setFlag2(true); buyToknMint(price, itemId, setFlag2, addr, PRIVATE_KEY);}}>구매하기</button>}
        {/* <button onClick={() => {set_w_Flag(true); buyTokn(PRIVATE_KEY);}}>Buy</button> */}
        <button onClick={()=>setFlag(false)}>cancel</button>
      </div>
    </div>
    ) : (
      <></>// showFlagがfalseの場合はModalは表示しない)
    )}
  </>)
}