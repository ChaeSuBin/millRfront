import React, { useEffect, useState } from "react";
import { getFileBolb } from "../../api";

export const FileListViewer = ({fileName, toknUri, permission}) => {
  
  const FilePreview = () => {
    const file = fileName.split('.');
    if(file[1] === 'JPG' || file[1] === 'JPEG' || file[1] === 'bmp'){
      const imgStock = `https://mintservice.asuscomm.com:8139/getimagestock/${toknUri}/${fileName}`;
      return(<>
        <img style={{width: '700px'}} src={imgStock}/>
      </>)
    }
    else if(file[1] === 'mp3' || file[1] === 'MP3'){
      const auxStock = `https://mintservice.asuscomm.com:8139/getaudiostock/${toknUri}/${fileName}`;
      return(<>
        <audio controls src={auxStock} />
      </>)
    }
  }
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
      <h5>{fileName}<br/>
        <FilePreview />
        <button onClick={downloadFileData}>download</button>
      </h5>
    </>
    )
}