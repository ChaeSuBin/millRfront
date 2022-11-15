import { getItemStatus, getTokenUri, getToknStatus, hexToUTF8 } from "../../utilityUnits/connMintService";

export const getBlockInfo = async(_itemId) => {
    let count = 0;
    const toknStatus = await getItemStatus(_itemId);
    const toknURI = toknStatus.fileHash;
    const useRange = setPermissionUse(toknURI.split('/'));
    do{
        toknStatus.royalty /= 1000000;
        toknStatus.price /= 1000000;
    }while(++count < 3)
    
    return new Promise(resolve => {
        hexToUTF8(toknStatus.status).then(result => {
            resolve({
                price: toknStatus.price,
                royalty: toknStatus.royalty,
                useRange: useRange,
                remain: toknStatus.limit,
                door: result
            })
        })
    })
}
export const getNftInfo = async(_toknId) => {
    let count = 0;
    const toknStatus = await getToknStatus(_toknId);
    const toknURI = await getTokenUri(_toknId);
    const fileHash = toknURI.split('/')[4];
    const useRange = setPermissionUse(toknURI.split('/'));
    do{
        toknStatus.royalty /= 1000000;
        toknStatus.price /= 1000000;
    }while(++count < 3)
    return new Promise(resolve => {
        hexToUTF8(toknStatus.status).then(result => {
            resolve({
                price: toknStatus.price,
                royalty: toknStatus.royalty,
                useRange: useRange,
                fileHash: fileHash,
                door: result
            })
        })
    })
}
const setPermissionUse = (splitedUri) => {
    if(splitedUri[3] === ''){
        return('Only for personal use');
      }
      else{
        if(splitedUri[2] !== 'CO')
          return(splitedUri[3] + ' (No commercially use)');
        else
          return(splitedUri[3] + ' (Commercially Avaliable)');
    }
}