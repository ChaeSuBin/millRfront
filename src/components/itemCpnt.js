import React from 'react';
import './card.css';
import { Link } from "react-router-dom";
import { getToknStatus, hexToUTF8 } from '../utilityUnits/connMintService';

export const  ListItemsCpnt = ({title, desc, toknId, itemId}) => {
  const sumNailUrl = null;

  return (
    <><div className="ToDoListItem">
      { toknId === undefined ? 
      <Link to={'/itemdetails/item/' + itemId } style={{ textDecoration: 'none' }}>
      <div className="ToDoListItem-title">title: {title}</div></Link>
      :<Link to={'/itemdetails/token/' + toknId } style={{ textDecoration: 'none' }}>
      <div className="ToDoListItem-title">title: {title}</div></Link>}
      
        { sumNailUrl===null ? <></>
          : <div><img src={sumNailUrl} /></div>
        }
      <div className="ToDoListItem-description">description: {desc}</div>
      </div>
    </>
  );
}

export const  ListItemsModal = ({title, desc, toknId, setToknId, setToknStt, flag}) => {

  const clickTitle = async() => {
    const toknState = await getToknStatus(toknId);
    setToknStt(await hexToUTF8(toknState.status));
    setToknId(toknId);
    flag(true);
  }
  return (
    <><div className="ToDoListItem">
      <div className="ToDoListItem-title" onClick={clickTitle}>title: {title}</div>
      <div className="ToDoListItem-description">description: {desc}</div>
      </div>
    </>
  );
}