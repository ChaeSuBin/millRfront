import React, { useEffect, useState }from 'react';
import { useNavigate } from 'react-router-dom';
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
  hexToUTF8
} from '../../utilityUnits/connMintService';
import { buyNFT } from '../../utilityUnits/connTradeService';
import { Help } from '../helpCpnt';

export const  ItemPage = ({cid, itemId, mode}) => {
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
    console.log('ip', mode);
    if(!mode){
      getToknSts(itemId - 1);
      getItemInfo(itemId);
      toknMintingEvtListener();
    }
    //downloadPermission();
  },[])

  const getToknSts = async(_id) => {
    let count = 0;
    const toknStatus = await getItemStatus(_id);
    const toknURI = toknStatus.fileHash;
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
      setStt({price: toknStatus.price, sts: result});
      //setStt({price: toknStatus.price});
    })
    setLeast(toknStatus.royalty);
  }

  
  const getItemInfo = async(_id) => {
    const toknStatus = await getItemStatus(_id-1);
    //console.log(toknStatus);
    const toknURI = toknStatus.fileHash;
    const fileHash = toknURI.split('/')[4];
    setUri(fileHash);
    getItem(fileHash).then(result => {
      setTitle(result.title);
      setDesc(result.description);
      //setStt({sts: 'OPEN'});
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
    const toknStatus = await getItemStatus(itemId-1);
    if(toknStatus.limit > 0)
      setFlag(true);
    else
      alert('this item is out of stock');
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
  const toknMintingEvtListener = async() => {
    const listen = await eventMintTokn(cid);
    console.log(listen);
  }
  return (
  <>
    <h3>itemDetailPage</h3>
    <h4>permission to use: <a style={{cursor: "help"}} onClick={(evt)=>helpOpen(evt, 0)}>{lisence}</a></h4>
    <h4>title: {title}</h4>
    <h4>description: {desc}</h4>
    {/* <h4>status: {status.sts}</h4> */}
    <h4>price: {status.price} MATIC</h4>
    <h4>royalty: <a style={{cursor: "help"}} onClick={(evt)=>helpOpen(evt, 1)}>{royalty} MATIC</a></h4>
    <button onClick={buyButton}>buy this item</button>
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
      SEND_ADDR = {cid}
      price = {status.price}
      itemId = {itemId-1}
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

const BuyModal = ({showFlag, SEND_ADDR, price, itemId, fileHash}) => {
  const navigate = useNavigate();
  const [PRIVATE_KEY, setPriv] = useState();
  
  const buyToknMint = async() => {
    const userId = await getUserId(SEND_ADDR);
    const value = parseInt(price*100000) + '0000000000000';
    const record = {
      hash: fileHash,
      //toknId: 0,
      userId: userId
    }
    mintingToken(SEND_ADDR, PRIVATE_KEY, itemId, value).then(result => {
      if(result === true){
        postMintTokn(record).then(resultIdx => {
          if(resultIdx){
            alert('🎉Successfully purchased');
            navigate("/");}
        })
      }
      else
        alert(`⚠️Err: ${result}`);
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
        <button onClick={buyToknMint}>Buy</button>
      </div>
    </div>
    ) : (
      <></>// showFlagがfalseの場合はModalは表示しない)
    )}
  </>)
}