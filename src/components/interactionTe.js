import React, { useState, useEffect } from "react";
import MintServiceABI from '../contracts/MintService.json';

export const Interaction = ({SEND_ADDR, PRIVATE_KEY, web3}) => {
  const [mintService, setService] = useState(null);
  const [nonce, setNonce] = useState();
  const [chainId, setChainId] = useState();
  
  useEffect(() => {
    if(web3 !== null && SEND_ADDR !==null ){
      setSignData();
    }
  },[web3, SEND_ADDR])

  const setSignData = async() => {
    const mintService = new web3.eth.Contract(
      MintServiceABI, '0x306a271F178aD37083cDA734F3Aca694FF301B0F'
    )
    setService(mintService);
    
    const nonce = await web3.eth.getTransactionCount(SEND_ADDR, 'latest');
    console.log('nonce: ', nonce);
    setNonce(nonce);

    const chainId = await web3.eth.getChainId();
    console.log('chainId: ', chainId);
    setChainId(chainId);
    
  }
  const getSymbol = () => {
    mintService.methods.symbol().call().then(
      symbol => {
        console.log('Tokn Symbol: ', symbol);
    },err => { 
      console.log('err: ', err); 
    })
  }
  const setNFT = async() => {
    const method = mintService.methods.CreateItem(SEND_ADDR, 'createTestUriInJS', 7);
    const code = await method.encodeABI();
    const gas = await method.estimateGas({from: SEND_ADDR});
    const gasPrice = await web3.eth.getGasPrice();

    const tx = {
      nonce: nonce,
      chainId: chainId,
      from: SEND_ADDR,
      to: '0x306a271F178aD37083cDA734F3Aca694FF301B0F',
      value: '0',
      data: code,
      gasPrice: gasPrice,
      gas: gas
    };
    //console.log(tx);
    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
      if (!error)
        console.log("🎉 The hash of your transaction is: ", hash, "\n Check Polygon Scan to view the status of your transaction!");
      else
        console.log("❗Something went wrong while submitting your transaction:", error);
    });
  }

  return(
    <>
      <h2>Contract Interaction</h2>
      <button onClick={getSymbol}>getSymbol</button>
      <button onClick={setNFT}>createItems</button>
    </>
  )
}