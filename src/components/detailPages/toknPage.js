import React, { useEffect, useState }from 'react';
import { 
  getItem, 
  getFileList, 
  getFileBolb, 
  getUserId, 
  postMintTokn,
  buyedToknChange } from '../../api';
import { 
  eventMintTokn,
  getItemStatus, 
  getTokenOwner,
  mintingToken,
  hexToUTF8,
	getToknStatus,
	getTokenUri,
  getApproveState
} from '../../utilityUnits/connMintService';
import { buyNFT, eventTradeTokn, tempbuynft } from '../../utilityUnits/connTradeService';
import { Help } from '../helpCpnt';

export const  ToknPage = ({cid, itemId, mode}) => {
  const [status, setStt] = useState({price: null, sts: null});
  const [chkOwn, setChkOwn] = useState(true);
  const [royalty, setLeast] = useState();
  const [itemUri, setUri] = useState();
  const [lisence, setLis] = useState([]);
  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();
  const [fileList, setList] = useState([]);
  const [modalFlag, setFlag] = useState(false);
  const [modalFlag2, setFlag2] = useState(false);
  const [helpMode, setHelpMod] = useState();

  useEffect(() => {
    console.log('tp', mode)
    if(mode){
      getToknSts(itemId);
      getItemInfo(itemId);
      toknTradeEvtListener();
    }
    //downloadPermission();
  },[])

  const getToknSts = async(_id) => {
    let count = 0;
    const toknStatus = await getToknStatus(_id);
		const toknURI = await getTokenUri(_id);
    // console.log(toknURI);
    // const toknOwner = await getTokenOwner(_id);
    // console.log(toknOwner);
    // const ownerState = await getApproveState(toknOwner);
    // console.log(ownerState);
    const splitedUri = toknURI.split('/');
    if(splitedUri[3] === ''){
      setLis('Only for personal use')
    }
    else{
      if(splitedUri[2] !== 'CO')
        setLis(splitedUri[3] + ' (No commercially use)');
      else
        setLis(splitedUri[3] + ' (Commercially Avaliable)')
    }
    do{
      toknStatus.royalty /= 1000000;
      toknStatus.price /= 1000000;
    }while(++count < 3)
    hexToUTF8(toknStatus.status).then(result => {
      if(result === 'Open')
        setStt({price: toknStatus.price, sts: result});
      else
        setStt({price: 'unseted', sts: result});
    })
    setLeast(toknStatus.royalty);
  }

  const getItemInfo = async(_id) => {
    const toknURI = await getTokenUri(_id);
    const fileHash = toknURI.split('/')[4];
    setUri(fileHash);
    getItem(fileHash).then(result => {
      setTitle(result.title);
      setDesc(result.description);
    })
    getItemFiles(fileHash);
  }
  const getItemFiles = (_uri) => {
    getFileList(_uri).then(result => {
      setList(result);
    })
  }
  const downloadPermission = () => {
    getTokenOwner(itemId).then(result => {
      if(result === cid)
        setChkOwn(true);
    })
  }

  const buyButton = async() => {
    if(status.sts === 'Open')
      setFlag(true);
    else
      alert('this item not for sale');
  }
  const helpOpen = (evt, helpMode) => {
    setFlag2(true);
    setHelpMod(helpMode);
    document.addEventListener('click', helpClose);
    evt.stopPropagation();
  }
  const helpClose = () => {
    setFlag2(false);
    document.removeEventListener('click', helpClose);
  }
  const toknTradeEvtListener = async() => {
    const listen = await eventTradeTokn(cid);
    console.log(listen);
  }
  return (
  <>
    <h3>itemDetailPage</h3>
    <h4><a style={{cursor: "help"}} onClick={(evt)=>helpOpen(evt, 0)}>permission to use: {lisence}</a></h4>
    <h4>title: {title}</h4>
    <h4>description: {desc}</h4>
    <h4>status: {status.sts}</h4>
    <h4>price: {status.price} MATIC</h4>
    <h4><a style={{cursor: "help"}} onClick={(evt)=>helpOpen(evt, 1)}>royalty: {royalty} MATIC</a></h4>
    <button onClick={buyButton}>buy this NFT</button>
    <br/><br/>
    {fileList.map((searchItems, index) => (
        <FileListViewer
          key={index}
          fileName={searchItems}
          toknUri = {itemUri}
          permission = {chkOwn}
        />
    ))}
    <BuyModal
      showFlag={modalFlag}
      setFlag = {setFlag}
      SEND_ADDR = {cid}
      price = {status.price}
      itemId = {itemId}
      fileHash = {itemUri}
    />
    <Help
      showFlag={modalFlag2}
      display = {helpMode}
    />
  </>
  );
}
const FileListViewer = ({fileName, toknUri, permission}) => {
  const downloadFileData = () => {
    if(permission){
      getFileBolb(toknUri, fileName).then(response => {
        let url = window.URL.createObjectURL(response);
        let a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
      })
    }
    else{
      alert('Attempt to download without permission');
    }
  }
  return(
  <>
    <h5>{fileName}
      <button onClick={downloadFileData}>download</button>
    </h5>
  </>
  )
}

const BuyModal = ({showFlag, setFlag, SEND_ADDR, price, itemId}) => {
  const [PRIVATE_KEY, setPriv] = useState();
  
  const buyToken = async() => {
    const userId = await getUserId(SEND_ADDR);
    const value = parseInt(price*100000) + '0000000000000';
    const record = {
      toknId: itemId,
      userId: userId
    }
    buyNFT(SEND_ADDR, PRIVATE_KEY, itemId, value).then(result => {
      if(result === true){
        buyedToknChange(record).then(resultIdx => {
          if(resultIdx){
            alert('🎉Successfully purchased');
            setFlag(false);
          }
        })
      }
      else
        alert(result);
      }
    )
  }
  return(<>
    {showFlag ? ( // showFlagがtrueだったらModalを表示する
    <div id="overlay" className='overlay'>
      <div id="modalcontents" className="modalcontents">
        <h4>coast: {price}</h4>
        <h5> PRIVATE_KEY :
          <input onChange={(evt)=>setPriv(evt.target.value)} size='45'></input></h5>
        <button onClick={buyToken}>Buy</button>
        <button onClick={()=>setFlag(false)}>cancel</button>
      </div>
    </div>
    ) : (
      <></>// showFlagがfalseの場合はModalは表示しない)
    )}
  </>)
}