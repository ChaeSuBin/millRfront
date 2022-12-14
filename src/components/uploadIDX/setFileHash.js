import React, { useState, useEffect } from "react";
import { onFileInputChange } from "../../utilityUnits/fileToBuffer";
import { fileToHash, setFinalHash } from '../../utilityUnits/fileToHash'
import { FilesList } from "../../components/dispFileList";
import { UploadFiles } from "./uploadFiles";

export const SetFileHash = ({pWire}) => {

  let te = -1;
  let hashArr = [];
  const [fileBuffer, setFileBuffer] = useState([]);
  const [fileInfo, setFileInfo] = useState([]);
  const [fileHashs, setFileHashs] = useState([]);
  const [endHash, setEndHash] = useState();
  const [passA, setCheckA] = useState(false);

  useEffect(() => {
    pWire(endHash);
  },[endHash])
  
  const extractHash = async() => {
    setCheckA(false);
    sortFileSize().then(result => {
      if(result){
        getFileHashArr();
      }
    })
  }
  const getFileHashArr = () => {
    hashArr = fileToHash(fileBuffer, setFileHashs);
    const endHash = getFinalHash(hashArr);
    UploadFiles(fileBuffer, fileInfo, endHash);
    setEndHash(endHash);
  }

  const sortFileSize = async() => {
    let asc = function (a, b) {
      return (a.length < b.length) ? -1 : 1;  //オブジェクトの昇順ソート
    }
    let ascIndex = function(a, b) {
      return (a.size < b.size) ? -1 : 1;
    }
    if(fileBuffer.length !== 0){
      fileBuffer.sort(asc);
      fileInfo.sort(ascIndex);
      return true;
    }
    else{
      return false;
    }  
  }
  
  const getFinalHash = (_hashArr) => {
    let fileNum = 0;
    let hashsStr = '';
    //let fileTypeArr = [];
    do {
      hashsStr += _hashArr[fileNum];
      //fileTypeArr.push((fileInfo[fileNum].type).split('/').pop());
      ++fileNum;
    } while (_hashArr.length > fileNum);
    return setFinalHash(hashsStr);
  }

  return(
    <div>
      <h3>업로드할 파일 선택</h3>
      <p>문서, 이미지, 오디오, 동영상 파일 가능</p>
      <label className="inputfile"><input type='file' 
        onChange={(evt)=>
          onFileInputChange(evt, setFileBuffer, setFileInfo, setCheckA)} 
        multiple/></label><br/>
      <br/>
      {fileInfo.map(uploadItems => (
        <FilesList
          key={uploadItems.name}
          row={++te}
          title = {uploadItems.name}
          type = {uploadItems.type}
          size = {uploadItems.size}
          hash = {fileHashs[te]}
        />
      ))}
      {passA ? 
      <>
        <button onClick={extractHash}>파일 업로드</button>-버튼을 누른 후 잠시 기다려주세요.
      </>:<>
      
      </>}
    </div>
  )
}