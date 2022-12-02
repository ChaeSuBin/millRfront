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
export const getItemInfoFromToknId = async(_toknId) => {
    return new Promise(resolve => {
        getItemTitle(_toknId).then(item => {
            resolve({
                title: item.title,
                desc: item.description,
                hash: item.hash,
                itemId: _toknId
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