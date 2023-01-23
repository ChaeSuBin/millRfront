import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { getOpenedItem, getOpenedTokn } from "../api";
import { ListItemsCpnt } from "../components/itemCpnt";

export const HomePage = () => {
  const [opendList, setOpend] = useState([]);
  const [pageNum, setPage] = useState(1);
  const [allItemRows, setRows] = useState(0);

  useEffect(() => {
    getOpenedItems(1);
  },[]);
  
  const getOpenedItems = async(_pageNum) => {
    const itemInfo = await getOpenedItem(_pageNum);
    // console.log(itemInfo[0]);
    setRows(itemInfo[1]);
    setOpend(itemInfo[0]);
  }
  const getOpenedTokns = async() => {
    let toknList = [];
    let itemLen = 0;
    const itemInfo = await getOpenedTokn();
    console.log(itemInfo);
    while(itemLen < itemInfo.toknIdList.length){
      toknList[itemLen] = {
        title: itemInfo.items[itemLen].title,
        description: itemInfo.items[itemLen].description, 
        toknId: itemInfo.toknIdList[itemLen]};
      ++itemLen;
    }
    setOpend(toknList);
  }
  const refreshPage = () => {
    window.location.assign('./filetohash');
  }
  const nextPage = (_page) => {
    if(allItemRows > _page*5){
      setPage(pageNum+1);
      getOpenedItems(_page+1);
    }
  }
  const prevPage = (_page) => {
    console.log(_page);
    if(_page > 1){
      setPage(pageNum-1);
      getOpenedItems(_page-1);
    }
  }
  return(
    <>
      <p style={{textAlign: "center"}}>
      <Link to="/filetohash" style={{ textDecoration: 'none' }}>
        <button onClick={refreshPage} style={{fontSize:"large"}}>아이템 업로드</button>
      </Link></p>
      <label><input type="radio" onChange={()=>getOpenedItems(pageNum)} name='comm' defaultChecked/>
        초기판매 아이템 목록 </label>
      <label><input type="radio" onChange={getOpenedTokns} name='comm'/>
        2차거래 NFT 목록 </label><br/>
      {opendList.map((searchItems, index) => (
        <ListItemsCpnt
          key={index}
          title={searchItems.title}
          desc={searchItems.description}
          toknId = {searchItems.toknId}
          itemId = {searchItems.id}
        />
      ))}
      <a onClick={()=>prevPage(pageNum)} style={{cursor: "pointer"}} >prev⬅️</a>
      {' '+pageNum+' '}
      <a onClick={()=>nextPage(pageNum)} style={{cursor: "pointer"}} >➡️next</a>
    </>
  )
}