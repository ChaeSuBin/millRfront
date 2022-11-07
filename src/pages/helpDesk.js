import React, { useState }from 'react';

export const HelpDesk= () => {
  const [howMint, setHM] = useState(false);
  const [howSale, setHS] = useState(false);
  const [howMatc, setMT] = useState(false);
  const [getMatc, setGM] = useState(false);
  const [whatpri, setPK] = useState(false);

  const howtomint = () => {
    if(howMint) setHM(false);
    else setHM(true);
  }
  const whatpriv = () => {
    if(whatpri) setPK(false);
    else setPK(true);
  }
  const howtosale = () => {
    if(howSale) setHS(false);
    else setHS(true);
  }
  const whatmatic = () => {
    if(howMatc) setMT(false);
    else setMT(true);
  }
  const getmatic = () => {
    if(getMatc)
      setGM(false);
    else
      setGM(true);
  }
  return(
    <>
      <h2>help</h2>
      <h4 onClick={whatmatic}>내 지갑 확인하기</h4>
      {howMatc ?
      <ol>
        <li>최초 로그인 시 화면 상단의 Account Info를 클릭하여 '계정정보' 페이지로 이동합니다.</li>
        <li>지갑 발급 버튼을 눌러 지갑주소를 부여받습니다.<br/>(이때 나오는 Private Key는 잊어버리지 않도록 잘 적어둡니다)</li>
        <li>페이지를 새로고침하여 내 계정과 연동된 지갑주소를 확인합니다.</li>
        <li>보유한 MATIC 코인은 Account Info의 'wallet' 항목에서 확인할 수 있습니다</li>
      </ol> : <></>}
      <h4 onClick={whatpriv}>지갑주소는 뭐고 Private key는 뭔가요?</h4>
      {whatpri ?
      <ul>
        <li>지갑주소는 블록체인 네트워크상에 존재하는 고유한 주소값입니다.</li>
        <li>지갑주소를 통해 보유한 코인을 확인하고 거래정보를 추적합니다.</li>
        <li>Private key는 블록체인상에서 거래를 발생시킬 시 사용하는 개인서명입니다</li>
        <li>모든 거래는 수수료를 동반하며 이때 Private key로 서명을 해주어야 거래가 일어납니다.</li>
        <li>때문에 Private key가 타인에게 노출되면 원치않는 거래가 일어날 수 있으니 절대로 타인에게 알려주어서는 안됩니다. </li>
        <li>Private key는 MillRnft에서 따로 데이터베이스에 저장하지 않으니 잊어버리지 않도록 잘 관리합시다.</li>
      </ul> : <></>}
      <h4 onClick={getmatic}>코인은 어떻게 얻나요?</h4>
      {getMatc ? 
      <ul>
        <li>테스트 기간중 메틱코인은 아래의 URL 에서 하루에 0.5 코인씩 얻을 수 있습니다.</li>
        <li><a href='https://mumbaifaucet.com/'>테스트 코인 얻으러 가기</a></li>
        <li> Test 기간이 끝나면, '거래소'를 통해서 구입합니다. <br/>(이 방법에 대해서는 test기간 후, 안내드립니다.)</li>
      </ul> : <></>
      }
      <h4 onClick={howtomint}>NFT는 어떻게 만들어 판매하나요?</h4>
      {howMint ? 
      <ol>
        (본 작업을 수행하기 전 0.01 이상의 MATIC 코인이 있는지 확인하십시오)
        <li>좌상단의 home 버튼을 눌러 '홈 화면'으로 이동</li>
        <li>'홈 화면'에서 createNFT 버튼을 눌러 아이템 생성페이지로 이동</li>
        <li>아이템의 제목과 부가설명을 입력</li>
        <li>choose file 버튼을 클릭하여 업로드할 파일 선택</li>
        <li>extract 버튼을 클릭하여 파일 식별자 생성<br/>(이 작업은 시간이 걸립니다)</li>
        <li>식별자 생성 완료 후 보여지는 upload 버튼을 클릭하여 파일 업로드</li>
        <li>발행할 NFT 갯수와 PRIVATE_KEY 를 입력후 판매시작 버튼을 클릭</li>
        <li>홈 화면으로 이동하여 배포중인 NFT 토글 클릭</li>
        <li>판매중인 내 아이템 확인</li>
      </ol> : <></>}
      <h4 onClick={howtosale}> 보유한 NFT는 어떻게 판매하나요?</h4>
      {howSale ? 
      <ol>
        (본 작업을 수행하기 전 0.01 이상의 MATIC 코인이 있는지 확인하십시오)
        <li>화면 상단의 Account Info 버튼을 눌러 '계정정보' 페이지로 이동</li>
        <li>화면 아래의 보유한 NFT 목록에서 판매를 원하는 NFT 클릭</li>
        <li>해당 NFT 정보를 확인하고 판매가격과 Private key를 입력</li>
        <li>start sale 버튼을 눌러 판매 시작</li>
        <li>'홈 화면'으로 이동하여 거래중인 NFT 토글 클릭 </li>
        <li>판매중인 내 NFT 확인</li>
      </ol> : <></>}
    </>
  )
}