import { getTokenUri, mintingToken } from '../../utilityUnits/connMintService';
import { getUserId, postMintTokn } from '../../api';

let count = 0;
let intervalId = null;

export const buyToknMint = async(_price, _itemId, setFlag, set_w_Flag, FROM_ADDR, PRIVATE_KEY) => {
  console.log(PRIVATE_KEY);
  const value = parseInt(_price*100000) + '0000000000000';
  mintingToken(FROM_ADDR, PRIVATE_KEY, _itemId, value).then(result => {
    if(result === true){
      intervalId = setInterval(() => {
        if(count > 9){
          stopTimer();
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
export const serveToknIdx = async(_toknId, FROM_ADDR) => {
  const userId = await getUserId(FROM_ADDR);
  const fileHash = await getFileHash(_toknId);
  const record = {
    hash: fileHash,
    toknId: _toknId,
    userId: userId
  }
  console.log(record);
  // if(_remain == 1){
  //   console.log(_remain);
  //   putItemClose({itemID: idxId});
  // }
  postMintTokn(record).then(resultIdx => {
    if(resultIdx){
      //set_w_Flag(false); setFlag(false);
      stopTimer();
      if(!alert('🎉Successfully purchased'))
        window.location.reload();
    }
  })
}

const getFileHash = async(_toknId) => {
  const toknURI = await getTokenUri(_toknId);
  const splitedUri = toknURI.split('/');
  return splitedUri[4];
}
const stopTimer = () => {
  clearInterval(intervalId);
  intervalId=null;
}