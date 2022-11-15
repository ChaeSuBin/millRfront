import React, { useEffect, useState, useRef }from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getItem, 
  getFileList, 
  getFileBolb, 
  getUserId, 
  postMintTokn,
  buyedToknChange, 
  putItemClose,
  getItemId} from '../../api';
import { 
  eventMintTokn,
  getItemStatus, 
  getTokenOwner,
  mintingToken,
  hexToUTF8
} from '../../utilityUnits/connMintService';
import { buyNFT } from '../../utilityUnits/connTradeService';
import { Help } from '../helpCpnt';
import { WaitModal } from '../waitModal';

export const  ItemPage = ({cid, itemId, mode}) => {
  let count = 0;
  const intervalId = useRef(null);
  const navigate = useNavigate();
  const [status, setStt] = useState({price: null, sts: null, amount: null});
  const [idxId, setIdxId] = useState();
  const [chkOwn, setChkOwn] = useState(true);
  const [royalty, setLeast] = useState();
  const [itemUri, setUri] = useState();
  const [lisence, setLis] = useState([]);
  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();
  const [fileList, setList] = useState([]);
  const [modalFlag, setFlag] = useState(false);
  const [modalFlag2, setFlag2] = useState(false);
  const [waitFlag, set_w_Flag] = useState(false);
  const [helpMode, setHelpMod] = useState();

  useEffect(() => {
    console.log('ip', mode);
    if(!mode){
      getToknSts(itemId);
      toknMintingEvtListener();
    }
    //downloadPermission();
  },[])
  
  const getToknSts = async(_rowId) => {
    let count = 0;
    const itemIdxId = await getItemId(_rowId);
    const toknStatus = await getItemStatus(itemIdxId);
    //console.log(toknStatus, itemIdxId);
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
      setStt({price: toknStatus.price, sts: result, amount: toknStatus.limit});
      //setStt({price: toknStatus.price});
    })
    setIdxId(itemIdxId);
    setLeast(toknStatus.royalty);
    getItemInfo(itemIdxId);
  }

  
  const getItemInfo = async(_idxid) => {
    const toknStatus = await getItemStatus(_idxid);
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
    const toknStatus = await getItemStatus(idxId);
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

  const serveToknIdx = async(_toknId) => {
    const userId = await getUserId(cid);
    const record = {
      toknId: _toknId,
      userId: userId
    }
    console.log(record);
    if(status.amount == 1){
      console.log(status.amount);
      putItemClose({itemID: idxId});
    }
    postMintTokn(record).then(resultIdx => {
      if(resultIdx){
        set_w_Flag(false); setFlag(false);
        clearInterval(intervalId.current);
        intervalId.current=null;
        alert('🎉Successfully purchased');
        navigate("/");}
    })
  }
  const buyToknMint = async(PRIVATE_KEY) => {
    console.log(PRIVATE_KEY);
    const value = parseInt(status.price*100000) + '0000000000000';
    mintingToken(cid, PRIVATE_KEY, idxId, value).then(result => {
      if(result === true){
        intervalId.current = setInterval(() => {
          if(count > 9){
            clearInterval(intervalId);
            set_w_Flag(false); setFlag(false);
            alert('입력하신 Private Key가 다른 주소의 키 같습니다\n 키를 확인 후 다시 시도하여주십시오.')
          }
          else
            ++count;
        }, 1000);
      }
      else{
        set_w_Flag(false);
        alert(`⚠️Err: ${result}`);
      }
    })
  }
  const toknMintingEvtListener = async() => {
    const listen = await eventMintTokn(cid);
    serveToknIdx(listen.toknId);
  }

  const tempa = (priv) => {
    console.log(priv);
    const value = parseInt(status.price*100000) + '0000000000000';
    console.log(value);
    console.log(idxId);
  }
  return (
  <><br/>
    <h3>title: {title}</h3>
    <h4>permission to use: <a style={{cursor: "help"}} onClick={(evt)=>helpOpen(evt, 0)}>{lisence}</a></h4>
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
      setFlag = {setFlag}
      price = {status.price}
      set_w_Flag = {set_w_Flag}
      buyTokn = {buyToknMint}
    />
    <WaitModal showFlag={waitFlag} />
    <Help
      showFlag={modalFlag2}
      display = {helpMode}
    />
  </>
  );
}
const BuyModal = ({showFlag, setFlag, price, set_w_Flag, buyTokn}) => {
  
  
  const [PRIVATE_KEY, setPriv] = useState();
  
  return(<>
    {showFlag ? ( // showFlagがtrueだったらModalを表示する
    <div id="overlay" className='overlay'>
      <div id="modalcontents" className="modalcontents">
        <h4>가격: {price} Matic</h4>
        <h5> PRIVATE_KEY :
          <input onChange={(evt)=>setPriv(evt.target.value)} size='45'></input></h5>
        <button onClick={() => {set_w_Flag(true); buyTokn(PRIVATE_KEY);}}>Buy</button>
        <button onClick={()=>setFlag(false)}>cancel</button>
        
      </div>
    </div>
    ) : (
      <></>// showFlagがfalseの場合はModalは表示しない)
    )}
  </>)
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