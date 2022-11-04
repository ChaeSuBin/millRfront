import React from 'react';
import { useState, useEffect } from 'react';
import getWeb3 from '../getWeb3';

export const Web3connector = ({_web3}) => {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    //connector();
  })

  const connector = async() => {
    try{
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
          
      setWeb3(web3);
      console.log(web3);
    }
    catch(error){
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  const getAccount = () => {
    window.ethereum.request({ method: "eth_requestAccounts" }).then((result) => {
		setAccount(result[0]);
	  }).catch((error) => {
	  setErrorMessage(error.message);
	  });
  }
  const getUserBal = () => {
    _web3.eth.getBalance('0x989da3fE6886004BAe6Fe8fAD122c64a4F9896cf').then(balanc => {
      console.log(balanc);
    })
  }

  return(
    <>
      <p>web3 connector running</p>
      <a onClick={getAccount}>Confirm Account</a>
      {account}
      <br/>
      <button onClick={getUserBal}>UserBal</button>
    </>
  )
}