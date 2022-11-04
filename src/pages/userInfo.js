import React from 'react';
import { CreateChainId } from '../components/createChainId';
import { SetMyNFT } from '../components/setMyNft';
import { Wallet } from './wallet';

export const UserInfoPage = ({web3, chainId}) => {
  const scanUrl = `https://mumbai.polygonscan.com/address/${chainId}`;
  const uid = sessionStorage.getItem('userid');

  return(
    <>
      <h2>Account Info</h2>
      <h4>user ID: {uid}</h4>
      {chainId == null ? 
        <>
          <h4>chainId: 아직 {uid} 계정에 연결되어있는 chainId 가 없습니다.</h4>
          <CreateChainId uid={uid} web3={web3}/>
        </> : <>
          <h4>chainID: <a href={scanUrl}>{chainId}</a></h4>
          <Wallet web3={web3} ADDR={chainId} />
          <SetMyNFT chainId={chainId} />
        </>}
    </>
  )
}