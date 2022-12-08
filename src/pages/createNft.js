import React, { useState, useEffect } from "react";
import { SetFileHash } from "../components/uploadIDX/setFileHash";
import { SetItemCpnt } from "../components/uploadIDX/setItem";
import { RightBranch } from "../components/uploadIDX/rightBranch";

export const CreateNft = ({web3}) => {
  const uid = sessionStorage.getItem('userid');
  const SEND_ADDR = sessionStorage.getItem('chainid');
  const [balance, setBalance] = useState(0);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [itemHash, setHash] = useState(null);
  const [plusUri, setRight] = useState();
  const [loginFlag, setFlag] = useState(false);

  useEffect(() => {
    initCheck();
  },[])

  const initCheck = async() => {
    const balZero = await getUserBal();
    checkLogined(balZero);
  }
  const getUserBal = async() => {
    return new Promise(resolve => {
      if(SEND_ADDR === null){
        resolve(true);
      }
      web3.eth.getBalance(SEND_ADDR).then(balanc => {
        let count = 0;
        do{
          balanc /= 1000000;
          ++count;
        }while(count < 3)
        if(balanc < 0.01)
          resolve(true);
        else
          resolve(false);
      })
    })
  }

  const checkLogined = (balZero) => {
    if(balZero){
      setFlag(false);
    }
    else{
      setFlag(true);
    }
  }

  return(
    <>
      {loginFlag ? <><br/><br/><br/>
        <h3>아이템 제목/설명/이용범위 설정.</h3>
        <p>title: <input placeholder='title' onChange={(evt)=>setTitle(evt.target.value)}/></p>
        <p>description: <br/>
        <textarea name="docudesc" rows='5' cols='55' placeholder="아이템 설명을 입력해주세요.&#13;" 
          onChange={(evt) => setDesc(evt.target.value)}/></p>
        <RightBranch pWire={(rightInfo)=>setRight(rightInfo)}/>
        {itemHash == null ?
          <>
            <SetFileHash pWire={(hash)=>setHash(hash)} />
          </> : <>
            <SetItemCpnt title={title} desc={desc} toknUri={itemHash} rightInfo={plusUri}/>
          </>
        }  
      </>:<>
        <p>판매 아이템 업로드를 위한 폴리곤 코인(matic 코인)이 부족합니다.<br/>
        계정에 폴리곤 코인을 충전 후 다시 시도하여주시기 바랍니다.</p>
      </>}
      
    </>
  )
}