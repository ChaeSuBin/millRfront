import React from "react";
import { getFileBolb } from "../../api";

export const FileListViewer = ({fileName, toknUri, permission}) => {
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