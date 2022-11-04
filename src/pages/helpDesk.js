import React, { useState }from 'react';

export const HelpDesk= () => {
  const [howMint, setHM] = useState(false);
  const [howSale, setHS] = useState(false);
  const [howMatc, setMT] = useState(false);
  const [getMatc, setGM] = useState(false);

  const howtomint = () => {
    if(howMint) setHM(false);
    else setHM(true);
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
      <h4 onClick={howtomint}>How to mint token?</h4>
      {howMint ? 
      <ol>
        (본 작업을 수행하기 전 0.01 이상의 MATIC 코인이 있는지 확인하십시오)
        <li>좌상단의 home 버튼을 눌러 '홈 화면'으로 이동</li>
        <li>'홈 화면'에서 createNFT 버튼을 눌러 아이템 생성페이지로 이동</li>
        <li>아이템의 제목과 부가설명을 입력</li>
        <li>choose file 버튼을 클릭하여 업로드할 파일 선택</li>
        <li>extract 버튼을 클릭하여 파일 식별자 생성<br/>(이 작업은 시간이 걸립니다)</li>
        <li>식별자 생성 완료 후 보여지는 upload 버튼을 클릭하여 파일 업로드</li>
        <li>발행할 NFT 갯수와 PRIVATE_KEY 를 입력후 mint 버튼을 클릭</li>
        <li>'내 정보'로 이동하여 발행된 NFT 확인<br/>(NFT 발행까지는 1~2 분정도 걸릴 수 있습니다)</li>
      </ol> : <></>}
      <h4 onClick={howtosale}> How to sale token?</h4>
      {howSale ? 
      <ol>
        (본 작업을 수행하기 전 0.01 이상의 MATIC 코인이 있는지 확인하십시오)
        <li>myinfo 버튼을 눌러 '내 정보'로 이동</li>
        <li>'wallet' 항목에서 PRIVATE_KEY를 입력</li>
        <li>판매를 개시할 토큰 범위와 판매가격 입력</li>
        <li>sale Token 버튼을 눌러 판매 시작</li>
        <li>'홈 화면'으로 이동하여 판매중인 내 아이템 확인</li>
      </ol> : <></>}
      <h4 onClick={whatmatic}>What is MATIC coin</h4>
      {howMatc ?
      <ul>
        <li>MATIC 코인은 폴리곤 네트워크에서 사용되는 화폐단위입니다</li>
        <li>비트코인처럼 이체 가능한것은 물론 컨트랙트를 통한 상호작용시에도 사용됩니다</li>
        <li>보유한 MATIC 코인이 없다면 NFT 발행과 구입을 비롯한 상호작용이 불가능합니다</li>
        <li>보유한 MATIC 코인은 '내 정보'의 'wallet' 항목에서 확인할 수 있습니다</li>
      </ul> : <></>}
      <h4 onClick={getmatic}>How can I get MATIC coin</h4>
      {getMatc ? 
      <ul>
        <li><a href='https://mumbaifaucet.com/'>here</a></li>
      </ul> : <></>
      }
    </>
  )
}