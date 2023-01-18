async function request(path, options = {}) {
    const url = `https://mintservice.asuscomm.com:8139${path}`;
    // const url = `https://gc4t8kvc7c.execute-api.us-east-1.amazonaws.com${path}`;
    const response = await fetch(url, options);
    return response.json();
}

export async function getMatchCode(_userId, _vcode){
  return request(`/getmatchvcode/${_userId}/${_vcode}`);
}
export async function getMatchUserId(_userId) {
  return request(`/getmatchuserid/${_userId}`);
}
export async function getUserId(_chainAddr) {
  return request(`/getuserid/${_chainAddr}`);
}
export async function getOwnedItems(_userId) {
  return request(`/getowneditem/${_userId}`);
}
export async function getOwnedTokns(_userId) {
  return request(`/getownedtokn/${_userId}`);
}
export async function getItemTitle(_toknId) {
  return request(`/getitemtitle/${_toknId}`);
}
export async function getItemsIdList(_userId, _itemHash) {
  return request(`/getidlist/${_userId}/${_itemHash}`);
}
export async function getChainId(_userId) {
  return request(`/chainacc/${_userId}`);
}
export async function getMerge(_fileName, _fileHash) {
  return request(`/merge/${_fileName}/${_fileHash}`);
}
export async function getItem(_rowId) {
  return request(`/iteminfo/${_rowId}`);
}
export async function getToknId(_fromAddr){
  return request(`/toknid/${_fromAddr}`);
}
export async function getDonateList(){
  return request('/donatelist');
}
export async function getOpenedItem(_page){
  return request(`/openeditems/${_page}`);
}
export async function getOpenedTokn(){
  return request('/openedtokns');
}
export async function getHash(_toknId) {
  return request(`/toknhash/${_toknId}`);
}
export async function getFileList(_toknUri) {
  return request(`/dirsync/${_toknUri}`);
}
export async function getFileBolb(_dirName, _fileName){
  const url = `https://mintservice.asuscomm.com:8139/downpath/${_dirName}/${_fileName}`;
  const response = await fetch(url);
  return response.blob();
}
export async function putChainId(record) {
  return request(`/setchainid`, {
    body: JSON.stringify(record),
    headers: {"Content-Type": "application/json"},
    method: "PUT",
  });
}
export async function putItemClose(record) {
  return request(`/setitemclose`, {
    body: JSON.stringify(record),
    headers: {"Content-Type": "application/json"},
    method: "PUT",
  });
}
export async function putToknSale(record) {
  return request(`/settoknsale`, {
    body: JSON.stringify(record),
    headers: {"Content-Type": "application/json"},
    method: "PUT",
  });
}
export async function buyedToknChange(record) {
  return request(`/buytoknchange`, {
    body: JSON.stringify(record),
    headers: {"Content-Type": "application/json"},
    method: "PUT",
  });
}
export async function putLogin(record) {
  return request(`/usercheckin`, {
    body: JSON.stringify(record),
    headers: {"Content-Type": "application/json"},
    method: "PUT",
  });
}
export async function postRegiPlayer(record) {
  return request(`/regiplayer`, {
    body: JSON.stringify(record),
    headers: {"Content-Type": "application/json"},
    method: "POST",
  });
}
export async function postTempuserTable(record) {
  return request(`/createtempuser`, {
    body: JSON.stringify(record),
    headers: {"Content-Type": "application/json"},
    method: "POST",
  });
}
export async function postUploadArtwork(record) {
  return request(`/fileupload`, {
    body: JSON.stringify(record),
    headers: {"Content-Type": "application/json"},
    method: "POST",
  });
}
export async function postUploadItemIdx(record) {
  return request(`/fileinfoupload`, {
    body: JSON.stringify(record),
    headers: {"Content-Type": "application/json"},
    method: "POST",
  });
}
export async function postMintTokn(record) {
  return request(`/minttoknidx`, {
    body: JSON.stringify(record),
    headers: {"Content-Type": "application/json"},
    method: "POST",
  });
}