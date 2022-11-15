import React, { useState, useEffect } from "react";
import { SetFileHash } from "../components/uploadIDX/setFileHash";
import { SetItemCpnt } from "../components/uploadIDX/setItem";
import { RightBranch } from "../components/uploadIDX/rightBranch";

export const CreateNft = ({web3}) => {
  const uid = sessionStorage.getItem('userid');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [itemHash, setHash] = useState(null);
  const [plusUri, setRight] = useState();
  const [loginFlag, setFlag] = useState(false);

  useEffect(() => {
    checkLogined(uid);
    console.log(uid);
  },[])

  const checkLogined = (uid) => {
    if(uid === null){
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
        <p>판매 아이템 업로드를 위해 로그인이 필요합니다.</p>
      </>}
      
    </>
  )
}