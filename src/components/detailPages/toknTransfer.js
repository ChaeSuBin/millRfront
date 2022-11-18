import { buyedToknChange, getUserId } from '../../api';
import { buyNFT } from '../../utilityUnits/connTradeService.js'

let intervalId = null;
let count = 0;

export const buyToknTransfer = async(_price, _itemId, set_w_Flag, FROM_ADDR, PRIVATE_KEY) => {
  const value = parseInt(_price*100000) + '0000000000000';
	console.log(_itemId);
  buyNFT(FROM_ADDR, PRIVATE_KEY, _itemId, value).then(result => {
    if(result === true){
      intervalId = setInterval(() => {
        if(count > 9){
          stopTimer();
					set_w_Flag(false);
          alert('입력하신 Private Key가 다른 주소의 키 같습니다\n 키를 확인 후 다시 시도하여 주십시오.');
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
export const updateToknIdx = async(_buyerAddr, _toknId) => {
	console.log(_buyerAddr, _toknId);
	const userId = await getUserId(_buyerAddr);
	const record = {
		toknId: _toknId,
		userId: userId
	}
	buyedToknChange(record).then(result => {
		if(result){
			stopTimer();
      if(!alert('🎉Successfully purchased'))
        window.location.reload();
		}
	})
}
const stopTimer = () => {
  clearInterval(intervalId);
  intervalId=null;
}