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
import { CoperHome } from "./pages/cooperHome";
import { DonateList } from "./pages/donatelist";
import { Nav } from './components/naviCpnt';
function App() {
  const [triger, setTriger] = useState(false);
  const uid = sessionStorage.getItem('userid');
  const FROM_ADDR = sessionStorage.getItem('chainid');
  const web3 = new Web3('https://rpc-mumbai.maticvigil.com');
  
  return (
    <div>
      <header className="App">
        <Router>
          <Nav userId={uid} chainId={FROM_ADDR}></Nav>
          <section className="">
            <Routes>
              <Route exact path='/' element={<HomePage />}/>
              <Route exact path='/donatetemp' element={<DonateList />}/>
              <Route exact path='/cooperlate' element={<CoperHome />}/>
              <Route exact path='/helpdesk' element={<HelpDesk />}/>
              <Route exact path='/userregist' element={<RegistInput web3={web3}/>}/>
              <Route exact path='/signinpage' element={<LoginInput triger={(param) => setTriger(param)}/>}/>
              <Route exact path='/myinfo' element={<UserInfoPage web3={web3} chainId={FROM_ADDR}/>}/>
              <Route exact path='/filetohash' element={<CreateNft web3={web3} />}/>
              <Route exact path='/itemdetails/:mode/:id' element={<ItemDetail />}/>
            </Routes>
          </section>
        </Router>
      </header><br/><br/>
      <footer>millRnft v0.4.4 <br/>본 서비스는 베타버전으로서 NFT의 저작재산권등 이용 권리에 실제 효력은 없음을 밝힙니다.</footer>
    </div>
  );
}

export default App;
