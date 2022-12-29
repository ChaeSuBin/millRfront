import React from "react"

export const Help = ({showFlag, display}) => {
    const Description = () => {
      if(display === 0){
        return(<>
          <p>RDT: 복제하여 배포/전송 가능</p>
          <p>RWA: 복제하여 타 문서에 첨부/기재 가능</p>
          <p>DW: 해당 NFT의 파일을 이용하여 2차적 저작물 제작 가능</p>
          <p>EP: 공공 전시/공연 가능</p>
          <p>------------------이하 구버전 이용허락 목록(삭제예정)</p>
          <p>RR: Right of Reproduction</p>
          <p>RD: Right of Distribution</p>
          <p>RDW: Right of Derivative Works</p>
          <p>RT: Right of Public Transmission</p>
          <p>RE: Right of Exhibition</p>
          <p>RpP: Right of Public Performance</p>
          
        </>)
      }
      else if(display === 1){
        return(<>
          <p>This amount is  donated to the charity institution  you designate in the following blank,
          each time the transation of this NFT occurs.
          </p>
        </>)
      }
      else if(display ===2){
        return(<>
          <p>판매된 NFT의 정산금액으로서 자유롭게 인출가능.</p>
        </>)
      }
      else if(display ===3){
        return(<>
          <p>마켓을 통하여 현재 보유한 토큰을 타인에게 전송하기 위해<br/>
             마켓을 담당하고있는 스마트 컨트랙트에 토큰의 전송권한을 위임합니다.<br/>
             (*소지한 NFT를 판매하기 위해 판매자 등록이 필요합니다.)
          </p>
        </>)
      }
      else if(display ===4){
        return(<>
          <p>판매수량을 의미합니다<br/>
            예를 들어 100 을 입력 시 최초 100회 판매 후 판매가 종료됩니다.</p>
        </>)
      }
      else if(display ===5){
        return(<>
          <p>판매가격은 폴리곤 코인(matic 코인) 을 기준으로 합니다<br/>
            예를 들어 1 을 입력 시 구매자는 1 코인에 구입을 할 수 있습니다.<br/>
            폴리곤 코인의 현재 가격은 https://coinmarketcap.com/ko/currencies/polygon/ 에서 확인할 수 있습니다</p>
        </>)
      }
      else if(display ===6){
        return(<>
          <p>해당 작품의 NFT가 생성되어 팔릴 때마다 지정한 기관으로 수익의 일부가 송신됩니다.</p>
        </>)
      }
    }
    return(<>
      {showFlag ? ( // showFlagがtrueだったらModalを表示する
      <div id="overlay" className='overlay'>
        <div id="modalcontents" className="modalcontents">
          <Description />
        </div>
      </div>
      ) : (
        <></>// showFlagがfalseの場合はModalは表示しない)
      )}
    </>)
  }