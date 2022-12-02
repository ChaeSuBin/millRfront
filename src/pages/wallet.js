import React from "react";
import { useState, useEffect } from "react";
import { 
  getApproveState,
  getDeposit,
  withdrawSaleItemPrice,
} from "../utilityUnits/connMintService";
import { getTradeBalance, withdrawSaleToknPrice } from "../utilityUnits/connTradeService";
import { Help } from "../components/helpCpnt";
import { SHA256 } from "../utilityUnits/SHA256";

export const Wallet = ({web3, ADDR}) => {
  const [flagSend, setSendFlag] = useState(false);
  const [earning, setEarning] = useState();
  const [tradeEarning, setTEarning] = useState();
  const [balance, setBalance] = useState();

  const [PRIVATE_KEY, setPriv] = useState(null);
  const [modalFlag2, setFlag2] = useState(false);
  const [helpMode, setHelpMod] = useState();

  useEffect(() => {
    getUserBal();
  },[]);
  
  const getUserBal = async() => {
    let salesPrice = await getDeposit(ADDR);
    let earningTokn = await getTradeBalance(ADDR);
    web3.eth.getBalance(ADDR).then(balanc => {
      let count = 0;
      do{
        balanc /= 1000000;
        salesPrice /= 1000000;
        earningTokn /= 1000000;
        ++count;
      }while(count < 3)
      setBalance(balanc);
      setEarning(salesPrice);
      setTEarning(earningTokn);
    })
  }

  const helpOpen = (evt, helpMode) => {
    setFlag2(true);
    setHelpMod(helpMode);
    document.addEventListener('click', helpClose);
    evt.stopPropagation();
  }
  const helpClose = () => {
    setFlag2(false);
    document.removeEventListener('click', helpClose);
  }

  const withdrawFromMintservice = () => {
    if(validationCheck()){
      const amountCoin = parseInt(earning*100000)+'0000000000000';
      withdrawSaleItemPrice(ADDR, PRIVATE_KEY, amountCoin).then(result => {
        if(result === true)
          alert('withdraw completed');
        else
          alert(result);
      })
    }
  }
  const withdrawFromTradeService = () => {
    if(validationCheck()){
      const amountCoin = parseInt(tradeEarning*100000)+'0000000000000';
      withdrawSaleToknPrice(ADDR, PRIVATE_KEY, amountCoin).then(result => {
        if(result === true)
          alert('withdraw completed');
        else
          alert(result);
      })
    }
  }
  const validationCheck = () => {
    if(PRIVATE_KEY !== null)
      return true
    else{
      alert('!Private Key required');
      return false}
  }
  const tempbtn = () => {
    const pHash = SHA256(PRIVATE_KEY);
    console.log(pHash);
  }
  return (
  <>
    <h2>wallet</h2>
    <h4>잔고: {balance} MATIC
      <button onClick={()=>setSendFlag(true)}>send</button></h4>
    <h4><a style={{cursor: "help"}} onClick={(evt)=>helpOpen(evt, 2)}>아이템 발행 수입: {earning} MATIC</a>
      <button onClick={withdrawFromMintservice}>내 잔고로 이체</button></h4>
    <h4><a style={{cursor: "help"}} onClick={(evt)=>helpOpen(evt, 2)}>NFT 판매 수입: {tradeEarning} MATIC</a>
      <button onClick={withdrawFromTradeService}>내 잔고로 이체</button></h4>
    <h5> PRIVATE_KEY :
      <input onChange={(evt)=>setPriv(evt.target.value)} size='45'></input></h5>
    {/* <button onClick={tempbtn}>gethash</button> */}
    <CoinSendModal
      showFlag = {flagSend}
      setFlag = {setSendFlag}
      web3 = {web3}
      ADDR = {ADDR}
      PRIVATE_KEY = {PRIVATE_KEY}
    />
    <Help
      showFlag={modalFlag2}
      display = {helpMode}
    />
  </>
  );
}
const CoinSendModal = ({showFlag, setFlag, web3, ADDR, PRIVATE_KEY}) => {
  const [rcvAcc ,setRcvAddress] = useState('');
  const [sendAmount, setAmount] = useState(0);

  const sendCoin = async() => {
    const value = parseInt(sendAmount*100000)+'0000000000000';
    const nonce = await web3.eth.getTransactionCount(ADDR, 'latest'); // nonce starts counting from 0
    const transaction = {
     'to': rcvAcc, // faucet address to return eth
     'value': value,
     'gas': 30000,
     'nonce': nonce,
     // optional data field to send message or execute smart contract
    };
    const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {

      if (!error)
        console.log("🎉 The hash of your transaction is: ", hash, "\n Check Polygon Scan to view the status of your transaction!");
      else
        console.log("❗Something went wrong while submitting your transaction:", error);
    });
  }

  return(<>
    {showFlag ? ( // showFlagがtrueだったらModalを表示する
    <div id="overlay" className='overlay'>
      <div id="modalcontents" className="modalcontents">
        <h5>Transfer Amount: <input onChange={(evt) => setAmount(evt.target.value)}/></h5>
        <h5>Receiver:<input onChange={(evt)=>setRcvAddress(evt.target.value)} placeholder='receiver Address 0x...' size='45'></input></h5>
        <button onClick={sendCoin}>send coin</button> 
        <button onClick={()=>setFlag(false)}>cancel</button>
      </div>
    </div>
    ) : (
      <></>// showFlagがfalseの場合はModalは表示しない)
    )}
  </>)
}