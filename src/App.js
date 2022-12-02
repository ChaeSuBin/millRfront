import React, { useState, useEffect } from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Web3 from "web3/dist/web3.min.js";
import { CreateNft } from './pages/createNft.js';
import { HomePage } from './pages/rootPage';
import { UserInfoPage } from "./pages/userInfo";
import { LoginInput, RegistInput } from './pages/loginPage';
import { ItemDetail } from "./pages/itemDtail";
import { HelpDesk } from "./pages/helpDesk";
import { Nav } from './components/naviCpnt';
// import { eventMintTokn } from './utilityUnits/connMintService';
// import { serveToknIdx } from './components/detailPages/toknMint';
// import { eventTradeTokn } from "./utilityUnits/connTradeService";
// import { updateToknIdx } from "./components/detailPages/toknTransfer";

function App() {
  const [triger, setTriger] = useState(false);
  const uid = sessionStorage.getItem('userid');
  const FROM_ADDR = sessionStorage.getItem('chainid');
  const web3 = new Web3('https://rpc-mumbai.matic.today');
  // const web3 = new Web3('wss://ws-mumbai.matic.today');

  // useEffect(() => {
  //   toknMintingEvtListener();
  //   toknTransferEvtListerner();
  // })
  // const toknMintingEvtListener = async() => {
  //   const listen = await eventMintTokn(FROM_ADDR);
  //   serveToknIdx(listen.toknId, FROM_ADDR);
  // }
  // const toknTransferEvtListerner = async() => {
  //   const listen = await eventTradeTokn(FROM_ADDR);
  //   updateToknIdx(listen.buyer, listen.toknId);
  // }
  
  return (
    <div className="App">
      <header>
        <Router>
          <Nav userId={uid} chainId={FROM_ADDR}></Nav>
          <section className="">
            <Routes>
              <Route exact path='/' element={<HomePage />}/>
              <Route exact path='/helpdesk' element={<HelpDesk />} />
              <Route exact path='/userregist' element={<RegistInput web3={web3}/>}/>
              <Route exact path='/signinpage' element={<LoginInput triger={(param) => setTriger(param)}/>}/>
              <Route exact path='/myinfo' element={<UserInfoPage web3={web3} chainId={FROM_ADDR}/>}/>
              <Route exact path='/filetohash' element={<CreateNft />}/>
              <Route exact path='/itemdetails/:mode/:id' element={<ItemDetail />}/>
            </Routes>
          </section>
        </Router>
      </header>
    </div>
  );
}

export default App;
