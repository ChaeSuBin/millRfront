import React, { useState, useEffect } from "react";
import { SetFileHash } from "../components/setFileHash";
import { MintItemCpnt } from "../components/mintItem";
import { RightBranch } from "../components/rightBranch";

export const CreateNft = ({web3}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [itemHash, setHash] = useState(null);
  const [plusUri, setRight] = useState();

  return(
    <>
      <h5>title: <input placeholder='title' onChange={(evt)=>setTitle(evt.target.value)}/></h5>
      <h5>description: <br/>
      <textarea name="docudesc" rows='5' cols='55' placeholder="description of the NFT to upload&#13;" 
        onChange={(evt) => setDesc(evt.target.value)}/></h5>
      <RightBranch pWire={(rightInfo)=>setRight(rightInfo)}/>
      <SetFileHash pWire={(hash)=>setHash(hash)} />
      {itemHash == null ?
        <>
        </> : <>
          <MintItemCpnt title={title} desc={desc} toknUri={itemHash} rightInfo={plusUri}/>
        </>
      }
    </>
  )
}