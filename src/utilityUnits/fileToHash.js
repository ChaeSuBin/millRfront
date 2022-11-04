import { getFileHash, SHA256 } from "./SHA256";

export const fileToHash = (_fileBuffer, setFileHash) => {
  let fileNum = 0
  let fileHashArr = [];
  
  do {
    console.log('processing...');
    fileHashArr.push(getFileHash(_fileBuffer[fileNum].join('')));
    ++fileNum;
  } while (_fileBuffer.length > fileNum);
  console.log('-done-');

  setFileHash(fileHashArr);
  return(fileHashArr);
}

export const setFinalHash = (str) => {
  const finalHash = SHA256(str);
  return finalHash;
}