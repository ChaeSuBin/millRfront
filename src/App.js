import React, { useState } from "react";
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Web3 from "web3/dist/web3.min.js";
import { CreateNft } from './pages/createNft.js';
import { ConnectWeb3 } from './pages/wallet';
import { HomePage } from './pages/rootPage';
import { UserInfoPage } from "./pages/userInfo";
import { LoginInput, RegistInput } from './pages/loginPage';
import { ItemDetail } from "./pages/itemDtail";
import { HelpDesk } from "./pages/helpDesk";
import { Nav } from './components/naviCpnt';

function App() {
  const [triger, setTriger] = useState(false);
  const uid = sessionStorage.getItem('userid');
  const cid = sessionStorage.getItem('chainid');
  const web3 = new Web3('wss://ws-mumbai.matic.today');
  
  return (
    <div className="App">
      <header>
        <Router>
          <Nav userId={uid} chainId={cid}></Nav>
          <section className="">
            <Routes>
              <Route exact path='/' element={<HomePage />}/>
              <Route exact path='/helpdesk' element={<HelpDesk />} />
              <Route exact path='/userregist' element={<RegistInput />}/>
              <Route exact path='/signinpage' element={<LoginInput triger={(param) => setTriger(param)}/>}/>
              <Route exact path='/myinfo' element={<UserInfoPage web3={web3} chainId={cid}/>}/>
              <Route exact path='/filetohash' element={<CreateNft web3={web3}/>}/>
              <Route exact path='/itemdetails/:mode/:id' element={<ItemDetail />}/>
            </Routes>
          </section>
        </Router>
      </header>
    </div>
  );
}

export default App;
