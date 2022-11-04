import React from "react"

export const Help = ({showFlag, display}) => {
    const Description = () => {
      if(display === 0){
        return(<>
          <p>RR: Right of Reproduction</p>
          <p>RD: Right of Distribution</p>
          <p>RDW: Right of Derivative Works</p>
          <p>RT: Right of Public Transmission</p>
          <p>RE: Right of Exhibition</p>
          <p>RP: Right of Public Performance</p>
          
        </>)
      }
      else if(display === 1){
        return(<>
          <p>최초 토큰 발행자(A)가 설정한 최소거래금액으로<br/>
          구매자(B)가 제3자(C)에게 판매할 경우 <br/>
          이 금액 밑으로 판매할 수 없음.<br/><br/>
          또한 B와 C사이의 거래가 이루어졌을 경우 <br/>
          최소거래금액은 자동으로 A에게 귀속되며<br/>
          판매액에서 최소거래금액을 제하여 B에게 정산됨.</p>
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