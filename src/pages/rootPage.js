import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { getOpenedItem, getOpenedTokn } from "../api";
import { ListItemsCpnt } from "../components/itemCpnt";

export const HomePage = () => {
  const [opendList, setOpend] = useState([]);

  useEffect(() => {
    getOpenedItems();
    //window.location.reload();
  },[]);
  
  const getOpenedItems = async() => {
    const itemInfo = await getOpenedItem();
    console.log(itemInfo);
    setOpend(itemInfo);
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
  return(
    <>
      <p style={{textAlign: "center"}}>
      <Link to="/filetohash" style={{ textDecoration: 'none' }}>
        <button style={{fontSize:"large"}}>create NFT</button>
      </Link></p>
      <h3>NFT 판매목록</h3>
      <label><input type="radio" onChange={getOpenedItems} name='comm' defaultChecked/>
        배포중인 NFT </label>
      <label><input type="radio" onChange={getOpenedTokns} name='comm'/>
        거래중인 NFT </label><br/>
      {opendList.map((searchItems, index) => (
        <ListItemsCpnt
          key={index}
          title={searchItems.title}
          desc={searchItems.description}
          toknId = {searchItems.toknId}
          itemId = {searchItems.id}
        />
      ))}
    </>
  )
}