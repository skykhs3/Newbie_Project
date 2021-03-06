import React, { Component } from 'react'
import Linkify from 'react-linkify'
import './Message.css';
import socket from '../../../../utils/socket'

function parseTime(time) {
  var res = time.split(" ");

  var temp2 = " ";
  if (res[3] < 12) {
    temp2 = "AM";
  }
  else {
    temp2 = "PM";
  }
  return temp2 + " " + (res[3] == 12 ? res[3] : res[3] % 12) + ":" + res[4];
}
function parseTime2(time) {
  var dayTable = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  var res = time.split(" ");
  var today = new Date(res[0] + '-' + res[1] + '-' + res[2]).getDay();
  return res[0] + " . " + res[1] + " . " + res[2] + " ( " + dayTable[today] + " ) ";
}
export default function XMessage(props) {
  const {
    data,
    isMine,
    isShowName,
    startsSequence,
    endsSequence,
    isShowTime,
    showTimestamp
  } = props;
  //    console.log("출력할 메세지 : "+data.content)
  //     console.log(
  //     [

  //       'message',
  // `${isMine ? 'mine' : ''}`,
  // `${startsSequence ? 'start' : ''}`,
  // `${endsSequence ? 'end' : ''}`
  //     ].join(' '));
  const componentDecorator = (href, text, key) => (
    <a href={href} key={key} target="_blank">
      {text}
    </a>
  );
  const onDoubleClickHandler =(event)=>{
    if(isMine){
    socket.emit('delete message', String(data._id));
    }
  }
  return (
    <div>
      <div className={[
        'message',
        `${isMine ? 'mine' : ''}`,
        `${startsSequence ? 'start' : ''}`,
        `${endsSequence ? 'end' : ''}`
      ].join(' ')}>
        {
          showTimestamp &&
          <div className="timestamp">
            {parseTime2(data.date)}
          </div>
        }

        {isShowName === true && isMine === false ? (<div className={(isMine ? "bubble-name-mine" : "bubble-name")}>
          {data.name} ( {data.email} )
        </div>) : null}
        <div className="bubble-container">

          {isMine === true ? <div className="timeStamp">
            {isShowTime === true ? parseTime(data.date) : null}
          </div> : null}
          <div className="bubble" onDoubleClick={onDoubleClickHandler}>
            {data.isDeleted === true ?

              //Todo className 여러개.
              <div className={"deleted"+(isMine===true? " mine": "")} >It is a deleted messasge.</div> :
              <Linkify componentDecorator={componentDecorator}>
                {data.content}
              </Linkify>
            }

          </div>
          {isMine === false ? <div className="timeStamp">
            {isShowTime === true ? parseTime(data.date) : null}
          </div> : null}
        </div>
      </div>
    </div>
  )
}

