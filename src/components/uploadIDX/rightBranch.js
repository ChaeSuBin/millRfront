import React, { useState, useEffect } from "react";

export const RightBranch = ({pWire}) => {
  const [right, setRight] = useState(['RR','RDW','RE','RPP']);//c
  const [disable, setDisable] = useState(false);
  const [exclusive, setExclusive] = useState('Public');//a
  const [comm, setComm] = useState('CO');//b
  const [viewRight, setView] = useState(false);
  const [tradeable, setTra] = useState(true);//d
  const [plusUri, setUri] = useState('');

  useEffect(()=>{
    let toknLisence;
    if(tradeable) toknLisence = `Tradeable/${exclusive}/${comm}/${right.join("-")}/`;
    else toknLisence = `nonTradea/${exclusive}/${comm}/${right.join("-")}/`;
    setUri(toknLisence);
    pWire(toknLisence);
  },[exclusive, comm, right, tradeable])

  const checkTradeable = (evt) => {
    if(evt.target.value !== "PO") setTra(false);
    else setTra(true);
  }
  const checkExclusive = (evt) => {
    if(evt.target.value !== "GE") setExclusive('Exclusive');
    else setExclusive('Public');
  }
  const checkCommercial = (evt) => {
    // setRight([]);
    if(evt.target.value === "CO"){
      setComm("CO");
      setView(true);
    }
    else if(evt.target.value === "NC"){
      setComm("NC");
      setView(true);
    }
    else{
      setComm("NC");
      setView(false);
    }
  }
//   const checkRight = (evt) => {
//     if(evt.target.value === 'RA'){
//       if(disable) setDisable(false);
//       else setDisable(true);
//     }
//     else{
//       let rightStr = '';
//     }
//   }
  const checkRight = (evt) => {
    if (right.includes(evt.target.value)) {
      setRight(
        right.filter((checkedValue) => checkedValue !== evt.target.value)
      );
    } else {
      setRight([...right, evt.target.value]);
    }
  };
  const temp = () => {
    console.log(plusUri);
  }
  return(
    <>
      {/* <button onClick={temp}>console</button> */}
      <br/>저작권 이용 가능 여부 지정<br/>
      <label><input type="radio" value="CO" onChange={checkCommercial} defaultChecked={true} name='comm'/>
        영리목적 이용 허가 </label>
      <label><input type="radio" value="NC" onChange={checkCommercial} name='comm'/>
        비영리적 이용 허가 </label><br/>
      {viewRight ? 
      <>
        <br/>허가할 이용 범위 지정<br/>
        {/* <label><input type="checkbox" value="RA" checked={right.includes("RA")} onChange={checkRight} name='right'/>
        모든 권리</label> */}
        <label><input type="checkbox" value="RDT" defaultChecked={true}onChange={checkRight} disabled={disable}/>
        복제하여 배포/전송 가능</label>
        <label><input type="checkbox" value="DW" defaultChecked={true}onChange={checkRight} disabled={disable}/>
        2차적 저작물 작성 가능</label>
        <label><input type="checkbox" value="EP" defaultChecked={true}onChange={checkRight} disabled={disable}/>
        공공전시/공연 가능</label>
        <label><input type="checkbox" value="RWA" defaultChecked={true}onChange={checkRight} disabled={disable}/>
        복제하여 타 문서에 기재/첨부 가능</label><br/>
      </> : <></>}
      {/* <br/>타인간 거래 가능여부 선택<br/>
      <label><input type="radio" value="PO" onChange={checkTradeable} name='tradeable' defaultChecked/>
        가능함 </label>
      <label><input type="radio" value="DI" onChange={checkTradeable} name='tradeable'/>
        불가함 </label><br/> */}
    </>
  )
}