import React from 'react'
import './Message.css';

function parseTime(time){
    var res = time.split(" ");

    var temp2=" ";
    if(res[3]<12){
        temp2="오전";
    }
    else{
        temp2="오후";
    }
    return temp2+" "+(res[3]==12?res[3]:res[3]%12)+":"+res[4];
  }
export default function XMessage(props) {
    const {
        data,
        isMine,
        isShowName,
        startsSequence,
        endsSequence,
        isShowTime,
      } = props;
  
    return (
   
            <div className={[
              'message',
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`
            ].join(' ')}>
              {/* {
                showTimestamp &&
                  <div className="timestamp">
                    { friendlyTimestamp }
                  </div>
              } */}
      
      {isShowName===true?(<div className="bubble-container">
                {data.name} ( {data.email} )
            </div>):null}
              <div className="bubble-container">

                 {isMine==true?<div className="timeStamp"> 
                  {isShowTime===true? parseTime(data.date):null}
                  </div>:null}
                <div className="bubble">
                  { data.content }
                </div>
                {isMine==false?<div className="timeStamp"> 
                  {isShowTime===true? parseTime(data.date):null}
                  </div>:null}
              </div>
            </div>
        
    )
}

