import React from "react"

export const WaitModal = ({showFlag}) => {
    return(
      <>{showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div id="overlay" className='overlay'>
          <div id="modalcontents" className="modalcontents">
            <h3>폴리곤 체인에 기록중...</h3>
          </div>
        </div>
        ) : (
          <></>// showFlagがfalseの場合はModalは表示しない)
        )}
      </>
    )
}