import MintServiceABI from '../contracts/MintService.json';
import Web3 from "web3/dist/web3.min.js";
const web3 = new Web3('wss://ws-mumbai.matic.today');
const MintServiceADDR = '0x55c2cF09ab6f15119ffc7024A27f83A69802D11a';
const MarketPlaceADDR = '0x1434F691eCefeA03ce6532a4cA99FD7E08764e2d';

const mintService = () => {
    const contract_Instance = new web3.eth.Contract(
      MintServiceABI, MintServiceADDR
    )
    return contract_Instance;
}

export const hexToUTF8 = async(hex) => {
    try{
        const result = web3.utils.hexToUtf8(hex);
        return result;
    }
    catch(err){
        const result = web3.utils.toAscii(hex);
        return result;
    }
}
export const getSymbol = async(web3) => {
    return new Promise(resolve => {
        mintService(web3).methods.symbol().call().then(
        symbol => {
            resolve(symbol);
        },err => { 
            console.log('err: ', err); 
        })
    })
}
export const getTokenOwner = async(toknId) => {
    return new Promise(resolve => {
        mintService().methods.ownerOf(toknId).call().then(
            result => {
                resolve(result);
            }
        )
    })
}
export const getTokenUri = async(toknId) => {
    return new Promise(resolve => {
        mintService().methods.tokenURI(toknId).call().then(
            result => {
                resolve(result);
            }
        )
    })
}
export const getToknStatus = async(toknId) => {
    //console.log(toknId);
    return new Promise(resolve => {
        mintService().methods.tradeNum(toknId).call().then(
            result => {
                resolve(result);
            }
        )
    })
}
export const getItemStatus = async(itemId) => {
    return new Promise(resolve => {
        mintService().methods.toknInfo(itemId).call().then(
            result => {
                resolve(result);
            }
        )
    })
}
export const getAmountAll = async() => {
    return new Promise(resolve => {
        mintService().methods.totalSupply().call().then(
            result => {
                resolve(result);
            }
        )
    })
}
export const getApproveState = async(ADDR) => {
    return new Promise(resolve => {
        mintService().methods.isApprovedForAll(ADDR, MarketPlaceADDR).call().then(
            result => {
                resolve(result);
            }
        )
    })
}
export const getDeposit = async(ADDR) => {
    return new Promise(resolve => {
        mintService().methods.getMyDeposit().call({from: ADDR}).then(
            result => {
                resolve(result);
            }
        )
    })
}
export const eventMintTokn = async(ADDR) => {
    return new Promise(resolve => {
        mintService().events.mintingEvt(
            {filter: {buyer: ADDR},
            fromBlock: 'latest'},
             (err, evt) => {
                console.log('event call: ', evt);
                resolve(evt.returnValues);            
        })
    })
}
export const eventCreateItem = async(ADDR) => {
    return new Promise(resolve => {
        mintService().events.createItemEvt(
            {filter: {creator: ADDR},
            fromBlock: 'latest'},
             (err, evt) => {
                console.log('event call: ', evt);
                resolve(evt.returnValues);            
        })
    })
}

export const EstSetApprovalAll = async(SEND_ADDR, agree) => {
    const method = await mintService(web3).methods.setApprovalForAll(MarketPlaceADDR, agree);
    const estGas = await method.estimateGas({from: SEND_ADDR});
    return estGas;
}
export const setApprovalAll = async(SEND_ADDR, PRIVATE_KEY, agree) => {
    const chainId = await web3.eth.getChainId();
    const nonce = await web3.eth.getTransactionCount(SEND_ADDR, 'latest');

    const method = await mintService().methods.setApprovalForAll(MarketPlaceADDR, agree);
    const gasPrice = await web3.eth.getGasPrice();
    const estGas = await method.estimateGas({from: SEND_ADDR});
    const code = await method.encodeABI();

    const tx = {
        nonce: nonce,
        chainId: chainId,
        from: SEND_ADDR,
        to: MintServiceADDR,
        value: '0',
        data: code,
        gasPrice: gasPrice,
        gas: estGas
    }
    const result = await signTrx(tx, PRIVATE_KEY);
    return result;
}
export const openToken = async(SEND_ADDR, PRIVATE_KEY, price, toknId) => {
    const chainId = await web3.eth.getChainId();
    const nonce = await web3.eth.getTransactionCount(SEND_ADDR, 'latest');
    
    const method = await mintService().methods.openTokn(price, toknId);
    const gasPrice = await web3.eth.getGasPrice();
    const code = await method.encodeABI();
    return new Promise(resolve => {
        method.estimateGas({from: SEND_ADDR}).then(estGas => {
            const tx = {
                nonce: nonce,
                chainId: chainId,
                from: SEND_ADDR,
                to: MintServiceADDR,
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
export const closeToken = async(SEND_ADDR, PRIVATE_KEY, toknId) => {
    const chainId = await web3.eth.getChainId();
    const nonce = await web3.eth.getTransactionCount(SEND_ADDR, 'latest');
    
    const method = await mintService().methods.closeTokn(toknId, SEND_ADDR);
    const gasPrice = await web3.eth.getGasPrice();
    const code = await method.encodeABI();
    return new Promise(resolve => {
        method.estimateGas({from: SEND_ADDR}).then(estGas => {
            const tx = {
                nonce: nonce,
                chainId: chainId,
                from: SEND_ADDR,
                to: MintServiceADDR,
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
export const setNFTidx = async(
    SEND_ADDR, 
    PRIVATE_KEY,
    toknURI, price, Royalty, amount) => {
    const chainId = await web3.eth.getChainId();
    const nonce = await web3.eth.getTransactionCount(SEND_ADDR, 'latest');
    const method = mintService().methods.createItem(SEND_ADDR, toknURI, price, Royalty, amount, '0x436c6f7365000000000000000000000000000000000000000000000000000000');
    const gasPrice = await web3.eth.getGasPrice();
    const code = await method.encodeABI();
    return new Promise(resolve => {
        method.estimateGas({from: SEND_ADDR}).then(estGas => {
            const tx = {
                nonce: nonce,
                chainId: chainId,
                from: SEND_ADDR,
                to: MintServiceADDR,
                value: '0',
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
export const mintingToken = async(SEND_ADDR, PRIVATE_KEY, itemID, itemPrice) => {
    console.log(SEND_ADDR, PRIVATE_KEY, itemID, itemPrice);
    const chainId = await web3.eth.getChainId();
    const nonce = await web3.eth.getTransactionCount(SEND_ADDR, 'latest');
    const method = mintService().methods.mintingItem(itemID);
    const gasPrice = await web3.eth.getGasPrice();
    const code = await method.encodeABI();
    return new Promise(resolve => {
        method.estimateGas({from: SEND_ADDR, value: itemPrice}).then(estGas => {
            const tx = {
                nonce: nonce,
                chainId: chainId,
                from: SEND_ADDR,
                to: MintServiceADDR,
                value: itemPrice,
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
export const withdrawSaleItemPrice = async(SEND_ADDR, PRIVATE_KEY, amount) => {
    const chainId = await web3.eth.getChainId();
    const nonce = await web3.eth.getTransactionCount(SEND_ADDR, 'latest');
    
    const method = mintService().methods.withDrawal(amount);
    const gasPrice = await web3.eth.getGasPrice();
    const code = await method.encodeABI();
    return new Promise(resolve => {
        method.estimateGas({from: SEND_ADDR}).then(estGas => {
            const tx = {
                nonce: nonce,
                chainId: chainId,
                from: SEND_ADDR,
                to: MintServiceADDR,
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
                    resolve(error);
            });
        }).catch(err => {
            console.log(err.message);
            resolve(err.message);
        })
    })
}