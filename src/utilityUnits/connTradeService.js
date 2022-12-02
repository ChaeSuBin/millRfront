import TradeMarketABI from '../contracts/MarketPlace.json';
import Web3 from "web3/dist/web3.min.js";
const web3 = new Web3('https://rpc-mumbai.matic.today');
const TradeServiceADDR = '0x1434F691eCefeA03ce6532a4cA99FD7E08764e2d';

const tradeService = () => {
  const contract_Instance = new web3.eth.Contract(
    TradeMarketABI, TradeServiceADDR
  )
  return contract_Instance;
}

export const getTradeBalance = async(SEND_ADDR) => {
  return new Promise(resolve => {
    tradeService().methods.getMyDeposit().call({from: SEND_ADDR}).then(
      result => {
        resolve(result);
      }
    )
  })
}
export const eventTradeTokn = async(ADDR) => {
  return new Promise(resolve => {
    tradeService().events.tradingEvt(
      {filter: {buyer: ADDR},
      fromBlock: 'latest'},
      (err, evt) => {
        console.log('event call: ', evt);
        resolve(evt.returnValues);            
    })
  })
}

export const buyNFT = async(SEND_ADDR, PRIVATE_KEY, toknId, toknPrice) => {
  const chainId = await web3.eth.getChainId();
  const nonce = await web3.eth.getTransactionCount(SEND_ADDR, 'latest');
  const method = tradeService().methods.buyTokn(toknId);
  const gasPrice = await web3.eth.getGasPrice();
  const code = await method.encodeABI();
  return new Promise(resolve => {
    method.estimateGas({from: SEND_ADDR, value: toknPrice}).then(estGas => {
      const tx = {
        nonce: nonce,
        chainId: chainId,
        from: SEND_ADDR,
        to: TradeServiceADDR,
        value: toknPrice, //web3.utils.toHex(web3.utils.toWei(toknPrice, 'ether')),
        data: code,
        gasPrice: gasPrice,
        gas: estGas
      };
      signTrx(tx, PRIVATE_KEY).then(result => {
        console.log(result);
        resolve(result);
      })
    }).catch(err => {
      console.log(err);
      resolve(err);
    })
  })
}

export const withdrawSaleToknPrice = async(SEND_ADDR, PRIVATE_KEY, amount) => {
  const chainId = await web3.eth.getChainId();
  const nonce = await web3.eth.getTransactionCount(SEND_ADDR, 'latest');
  
  const method = await tradeService().methods.withDrawal(amount);
  const gasPrice = await web3.eth.getGasPrice();
  const code = await method.encodeABI();
  return new Promise(resolve => {
    method.estimateGas({from: SEND_ADDR}).then(estGas => {
      const tx = {
        nonce: nonce,
        chainId: chainId,
        from: SEND_ADDR,
        to: TradeServiceADDR,
        value: '0',
        data: code,
        gasPrice: gasPrice,
        gas: estGas
      }
      signTrx(tx, PRIVATE_KEY).then(result => {
        console.log(result);
        resolve(result);
      })
    }).catch(err => {
      console.log(err);
      resolve(err);
    })
  })
}
const signTrx = (tx, PRIVATE_KEY) => {
  return new Promise(resolve => {
    web3.eth.accounts.signTransaction(tx, PRIVATE_KEY).then(signedTx => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
        if (!error)
          resolve(true);
        else
          resolve('Check again your Private_Key inputed');
      });
    }).catch(err => {
      console.log(err.message);
      resolve(err.message);
    })
  })
}