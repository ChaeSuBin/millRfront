import { buyedToknChange, getUserId, putLogin } from '../../api';
import { buyNFT } from '../../utilityUnits/connTradeService.js'
import { SHA256 } from '../../utilityUnits/SHA256';

let intervalId = null;
let count = 0;

export const buyToknTransfer = async(_price, _itemId, set_w_Flag, FROM_ADDR, PRIVATE_KEY) => {
  const record = {
    playerId: sessionStorage.getItem('userid'),
    playerPass: SHA256(PRIVATE_KEY)
  }
  if(await putLogin(record)){
    const value = parseInt(_price*100000) + '0000000000000';
    buyNFT(FROM_ADDR, PRIVATE_KEY, _itemId, value).then(result => {
      if(result === true)
        updateToknIdx(FROM_ADDR);
      else{
        alert('거래에 필요한 폴리곤 코인이 부족합니다 \n 코인을 충전한 후 다시 시도하여 주십시오');
        set_w_Flag(false)
      }
    })
  }
  else{
    alert(`⚠️ Private Key 를 확인 후 다시 시도하십시오`);
    set_w_Flag(false);
  }
}

const updateToknIdx = async(_buyerAddr) => {
	const userId = await getUserId(_buyerAddr);
	const record = {
		userId: userId,
    fromAddr: _buyerAddr
	}
	buyedToknChange(record).then(result => {
		if(result){
      if(!alert('🎉Successfully purchased'))
        window.location.reload();
		}
	})
}
const stopTimer = () => {
  clearInterval(intervalId);
  intervalId=null;
}