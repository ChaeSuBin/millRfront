
export const onFileInputChange = (e, setBuffer, setFileInfo, setCheckA) => {
  const fileByteArray = [];
  const fileInfo = [];
  let fileNum = 0;
  
  while(e.target.files.length > fileNum){
    const reader = new FileReader();
    const fileBufferArray = [];
        
    fileInfo.push({
      name: e.target.files[fileNum].name,
      type: e.target.files[fileNum].type,
      size: e.target.files[fileNum].size
    })
    //console.log(e.target.files[fileNum]);
    reader.readAsArrayBuffer(e.target.files[fileNum]);
    reader.onloadend = (_evt) => {
      if (_evt.target.readyState === FileReader.DONE) {
        const arrayBuffer = _evt.target.result,
        array = new Uint8Array(arrayBuffer);
        for (const a of array) {
          fileBufferArray.push(a);
        }
        fileByteArray.push(fileBufferArray);
        if(fileByteArray.length === fileNum){
          setCheckA(true);
        }
      }
    }
    ++fileNum;
  }
  setBuffer(fileByteArray);
  setFileInfo(fileInfo);
}