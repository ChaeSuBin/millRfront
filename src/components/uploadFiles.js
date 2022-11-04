import React, { useState }from "react";
import { postUploadArtwork, postUploadItemIdx, getMerge } from "../api";

export const UploadFiles = ({
    fileBufferList,
    fileInfoList,
    finalHash
  }) => {

  const [uploadState, setState] = useState(false);
  
  const setFileChunks = () => {
    const size = 1024 * 50; //50KB 50KB Section size
    fileBufferList.map(async(file, index) => {
      let fileChunks = [];
      let fileIndex = 0;
      for(let cur = 0; cur < file.length; cur += size) {
        fileChunks.push({
          section: fileIndex++,
          chunk: file.slice(cur, cur + size),
        });
      }
      uploadList(fileChunks, index++);
    })
    setTimeout(()=>{
      mergeChunks();
	  },2000);
  }
  const uploadList = (fileChunks, _index) => {
    fileChunks.map((item, index) => {
      const record = {
        fileName: fileInfoList[_index].name,
        section: item.section,
        chunk: item.chunk,
      }
      console.log(record);
      postUploadArtwork(record).then(result => {
        console.log(result);
      })
    })
  }
  const mergeChunks = async() => {
    fileInfoList.map((item, idx) => {
      getMerge(item.name, finalHash).then(response => {
        console.log(response);
        setState(true);
      })
    })
  }
  return(
    <>
      {finalHash == undefined ? <>
      </> : 
      <>
        <h4>uploadfiles.js</h4>
        
        {uploadState ? <p>upload complete</p>:<button onClick={setFileChunks}>upload</button>}
      </>}
    </>
  )
}