import React, { useEffect, useState }from 'react';
import { useParams } from "react-router-dom";
import { ItemPage } from '../components/detailPages/itemPage';
import { ToknPage } from '../components/detailPages/toknPage';

export const  ItemDetail = () => {
  const FROM_ADDR = sessionStorage.getItem('chainid');
  const locate = useParams();
  const [toknPage, setPage] = useState();

  useEffect(() => {
    if(locate.mode === 'token'){
      setPage(true);}
    else
      setPage(false);
  },[toknPage])
  
  return (
  <>
    {toknPage ? 
      <ToknPage
        cid = {FROM_ADDR}
        itemId = {locate.id}
        mode = {toknPage}
      />
      :<ItemPage
        cid = {FROM_ADDR}
        itemId = {locate.id}
        mode = {toknPage}
      />}
  </>
  );
}
