import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import "./LandingPage.css"
import socketIOClient from "socket.io-client";
import XMessage from './Message'
import ToolbarButton from './ToolbarButton'
import Compose from "./Compose"
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { IconButton } from "@material-ui/core"

//const socket = socketIOClient("http://whale.sparcs.org:45000");
const socket = socketIOClient("localhost:5000");
function parseTime(time) {
  return time.substring(0, 16);
}
function parseTime2(time) {
 // var res = time.split(" ");
  return time.substring(0, 10);
}
class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.mustScrollDown = true;
    this.mustClearTextField=false;
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
    socket.emit('send message', { name: this.state.name, message: this.state.message, email: this.state.email });
    this.setState({ message: "" });
    this.mustScrollDown = true;
  };
  onKeyDownHandler=(e)=>{
    //console.log("A :"+this.state.message+": B");
    if(e.key==='Enter' && !e.shiftKey && this.state.message!=="" ){
      socket.emit('send message', { name: this.state.name, message: this.state.message, email: this.state.email });
   
    this.mustScrollDown = true;
    this.mustClearTextField=true;
    }
    
  }
  onKeyUpHandler=()=>{
    if(this.mustClearTextField){
      this.setState({ message: '' });
      this.mustClearTextField=false;
    }
  }
  onChangeHandler = (event) => {
    this.setState({ message: event.target.value });
    console.log("채팅입력 : "+event.target.value);
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
          isShowName={i === 0 || this.state.messageList[i].email !== this.state.messageList[i - 1].email ? true : false || parseTime(this.state.messageList[i-1].date)!==parseTime(this.state.messageList[i].date)}
          startsSequence={
            i === 0 || this.state.messageList[i].email !== this.state.messageList[i - 1].email || parseTime(this.state.messageList[i-1].date)!==parseTime(this.state.messageList[i].date)? true : false
          }
          endsSequence={
            i === this.state.messageList.length - 1 || this.state.messageList[i].email !== this.state.messageList[i + 1].email || parseTime(this.state.messageList[i+1].date)!==parseTime(this.state.messageList[i].date)? true : false
          }
          isShowTime={
            i === this.state.messageList.length - 1 || this.state.messageList[i].email !== this.state.messageList[i + 1].email || parseTime(this.state.messageList[i].date) !== parseTime(this.state.messageList[i + 1].date) ? true : false
          }
          showTimestamp={
            i===0 || parseTime2(this.state.messageList[i-1].date)!==parseTime2(this.state.messageList[i].date) ? true:false
          }
        ></XMessage>
      );
    }
    return messageComponentList;
  }
  render() {
    return (
      <div className="App">
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
          onChange={this.onChangeHandler}
          onKeyDownHandler={this.onKeyDownHandler}
          onKeyUpHandler={this.onKeyUpHandler}
          test={"AAAB"}
        />

      </div>
    )
  }
}
export default withRouter(LandingPage)
