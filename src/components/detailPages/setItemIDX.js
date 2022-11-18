import { getItem, getFileList, getItemTitle } from "../../api";

export const getItemInfo = async(_rowId) => {
    return new Promise(resolve => {
        getItem(_rowId).then(item => {
            resolve({
                title: item.title,
                desc: item.description,
                hash: item.hash,
                itemId: item.itemid
            })
        })
    })
}
export const getItemInfoFromHash = async(_fileHash, _itemId) => {
    return new Promise(resolve => {
        getItemTitle(_fileHash).then(item => {
            resolve({
                title: item.title,
                desc: item.description,
                hash: _fileHash,
                itemId: _itemId
            })
        })
    })
}
export const getItemFiles = (_fileHash) => {
    return new Promise(resolve => {
        getFileList(_fileHash).then(result => {
            resolve(result);
        })
    })
}