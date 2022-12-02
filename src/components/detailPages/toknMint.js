import { getTokenUri, mintingToken } from '../../utilityUnits/connMintService';
import { getToknId, getUserId, postMintTokn, putLogin } from '../../api';
import { SHA256 } from '../../utilityUnits/SHA256';

export const buyToknMint = async(_price, _itemId, set_w_Flag, FROM_ADDR, PRIVATE_KEY) => {
  const record = {
    playerId: sessionStorage.getItem('userid'),
    playerPass: SHA256(PRIVATE_KEY)
  }
  if(await putLogin(record)){
    const value = parseInt(_price*100000) + '0000000000000';
    mintingToken(FROM_ADDR, PRIVATE_KEY, _itemId, value).then(result => {
      if(result === true)
        serveToknIdx(FROM_ADDR, _itemId);
      else{
        alert('거래에 필요한 폴리곤 코인이 부족합니다 \n 코인을 충전한 후 다시 시도하여 주십시오');
        set_w_Flag(false)
      }
    })
  }
  else{
    alert('Private Key 를 확인 후 다시 시도하십시오');
    set_w_Flag(false);
  }
}

export const serveToknIdx = async(FROM_ADDR, _itemId) => {
  const userId = await getUserId(FROM_ADDR);
  const toknId = await getToknId(FROM_ADDR);
  const fileHash = await getFileHash(toknId);
  const record = {
    hash: fileHash,
    toknId: toknId,
    itemId: _itemId,
    userId: userId
  }
  // if(_remain == 1){
  //   console.log(_remain);
  //   putItemClose({itemID: idxId});
  // }
  postMintTokn(record).then(resultIdx => {
    if(resultIdx){
      //set_w_Flag(false); setFlag(false);
      if(!alert('🎉Successfully purchased'))
        window.location.reload();
    }
  })
}

const getFileHash = (_toknId) => {
  return new Promise(resolve => {
    const looper = setInterval(() => {
      getTokenUri(_toknId).then(toknURI => {
        if(toknURI){
          const splitedUri = toknURI.split('/');
          clearInterval(looper);
          resolve(splitedUri[4]);
        }
      })
    }, 1000);
  })
}