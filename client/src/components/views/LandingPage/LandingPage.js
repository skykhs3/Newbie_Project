import React, { useEffect } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { Link } from "react-router-dom"
import "./LandingPage.css"
import socketIOClient from "socket.io-client";
import { useDispatch } from 'react-redux'
import { auth } from '../../../_actions/user_action';
import XMessage from './Message'
import ToolbarButton from './ToolbarButton'
import Compose from "./Compose"
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { IconButton } from "@material-ui/core"

import StarIcon from "@material-ui/icons/Star"
import FavoriteIcon from "@material-ui/icons/Favorite"
import SendIcon from '@material-ui/icons/Send';

const socket = socketIOClient('http://localhost:5000');
function parseTime(time) {
  var res = time.split(" ");
  return time.substring(0, 16);
}
class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.mustScrollDown = true;
    this.state = {
      email: "",
      nickName: '',
      name: "",
      message: "",
      messageList: [],
    }
  }
  componentDidMount() {
    //  const dispatch=useDispatch();
    window.scrollTo(0, document.body.scrollHeight)
    socket.emit('reset',);
    socket.on('receive message', (res) => {
      console.log("Receive msg");
      console.log(res);


      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        this.setState({ messageList: res });
        // you're at the bottom of the page

        window.scrollTo(0, document.body.scrollHeight)
      }
      else {
        this.setState({ messageList: res });
      }
      if (this.mustScrollDown) {
        window.scrollTo(0, document.body.scrollHeight);
        this.mustScrollDown = false;
      }
      // / this.messageList=
    });
    const data = axios.get('/api/users/auth').then(response => response.data);
    data.then(res => { this.setState({ email: res.email, name: res.name }); })
  }

  onSubmitHandler = (e) => {
    e.preventDefault();

    console.log("C " + this.state.message);
    socket.emit('send message', { name: this.state.name, message: this.state.message, email: this.state.email });
    this.setState({ message: "" });
    this.mustScrollDown = true;
  };
  onChangeHanler = (event) => {
    console.log("A " + this.state.message);
    this.setState({ message: event.target.value });
    console.log("B " + this.state.message);
    //  this.setState({ [event.target.name]: event.target.value });
  }
  onClickHandler = (event) => {
    axios.get('/api/users/logout').then(response => {
      console.log(response.data);
      if (response.data.success) {
        console.log("A");
        this.props.history.push("/login")
      }
      else {
        alert("로그아웃 실패")
      }

    }
    )
  }
  renderMessageList = () => {
    var messageComponentList = [];
    var i;
    for (i = 0; i < this.state.messageList.length; i++) {
      messageComponentList.push(
        <XMessage key={i} data={this.state.messageList[i]} isMine={this.state.email === this.state.messageList[i].email ? true : false}
          isShowName={i === 0 || this.state.messageList[i].email !== this.state.messageList[i - 1].email ? true : false}
          startsSequence={
            i === 0 || this.state.messageList[i].email !== this.state.messageList[i - 1].email ? true : false
          }
          endsSequence={
            i === this.state.messageList.length - 1 || this.state.messageList[i].email !== this.state.messageList[i + 1].email ? true : false
          }
          isShowTime={
            i === this.state.messageList.length - 1 || this.state.messageList[i].email !== this.state.messageList[i + 1].email || parseTime(this.state.messageList[i].date) !== parseTime(this.state.messageList[i + 1].date) ? true : false
          }
        ></XMessage>
      );
    }
    return messageComponentList;
  }
  render() {
    return (
      <div className="App">
        <section className="chat-list">

        </section>

        {/* <form className="chat-form"
          onSubmit={this.onSubmitHandler}>
          <div className="chat-inputs">

            <input
              type="text"
              autoComplete="off"
              onChange={this.onChangeHanler}
              name="nickName"
              value={this.state.nickName}
              placeholder="유저이름"
            />
            <input
              type="text"
              autoComplete="off"
              onChange={this.onChangeHanler}
              name="value"
              value={this.state.value}
              placeholder="메세지입력하기"
            />
          </div>
          <button type="submit">입력하기</button>
          </form> */}

        <div className="toolbar">
          <div className="left-items"> <div className="message">
            <p className="username">User Email : {this.state.email}</p>
            <p className="message-text">User Name : {this.state.name}</p>
          </div></div>
          <h1 className="toolbar-title">Sparcs Chat</h1>
          <div className="right-items">


            <div onClick={this.onClickHandler}>
              <IconButton  >
                <ExitToAppIcon style={{ fill: "white" }} stroke={"black"} stroke-width={1} />
              </IconButton>
            </div>
          </div>
        </div>
        <div className="messageList">
          {
            this.renderMessageList()

          }
        </div>
        <Compose rightItems={[
          <ToolbarButton key="photo" icon="ion-ios-camera" />,
          <ToolbarButton key="image" icon="ion-ios-image" />,
          <ToolbarButton key="audio" icon="ion-ios-mic" />,
          <ToolbarButton key="money" icon="ion-ios-card" />,
          <ToolbarButton key="games" icon="ion-logo-game-controller-b" />,
          <ToolbarButton key="emoji" icon="ion-ios-happy" />
        ]}
          message={this.state.message}
          onSubmit={this.onSubmitHandler}
          onChange={this.onChangeHanler}
          test={"AAAB"}
        />

      </div>
    )
  }
}
export default withRouter(LandingPage)
