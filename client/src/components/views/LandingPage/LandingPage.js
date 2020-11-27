import React,{useEffect} from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import { Link } from "react-router-dom"
import "./LandingPage.css"
import { Message } from '@material-ui/icons'
import socketIOClient from "socket.io-client";
import {useDispatch} from 'react-redux'
import {auth} from '../../../_actions/user_action';
// function LandingPage(props) {



//     useEffect(() => {
//         axios.get('/api/hello').then(response=>console.log(response.data))
//     }, [])
//     return (
//         <div>

//         <button onClick={onClickHandler}>
//             Sign Out
//             </button>
// <div style={{flex:"0 1 90%", background:"dodgerblue"}} ></div>
//             <input className="messengerBox"
//             plasceholder="Send a message..."
//             type="text"
//             >
//                 </input>
//         </div>
//     )
// }

class Msg {
    constructor(name,Message){
        this.name=name;
        this.Message=Message;
    }
}
const socket = socketIOClient('localhost:5000');
class LandingPage extends React.Component{

   

    constructor(props){
        super(props);
        this.state={
          email:"",
            name:'',
            value:"",
            messageList:[],
        }
    }
    onSubmitHandler=(e)=>{
      e.preventDefault();
      socket.emit('send message', { name: this.state.name, message: this.state.value });
    };
    onChangeHanler=(event)=>{
      this.setState({[event.target.name]:event.target.value});
    }
    onClickHandler=(event)=>{
        axios.get('/api/users/logout').then(response=>
            {console.log(response.data);
            if(response.data.success){
              console.log("A");
                this.props.history.push("/login")
            }
            else{
                alert("로그아웃 실패")
            }
            
            }
        )
    }
    componentDidMount(){
    //  const dispatch=useDispatch();
      socket.on('receive message', () => {
        console.log("Receive msg");
      });
      auth();
      // auth().then(response=>{
      //           //adminRoute가 true 홈페이지는 무조건 접근 가능, false면 무조건 접근 불가능
      //           this.setState({email:response.payload.email});
      //       });
    }
    render(){
        return (
            <div className="App">
            <section className="chat-list">
                  <div className="message">
                    <p className="username">username</p>
                    <p className="message-text">message</p>
                  </div>
            </section>
            <button onClick={this.onClickHandler}>Log out</button>
            <form className="chat-form" 
            onSubmit={this.onSubmitHandler}>
              <div className="chat-inputs">
                
                <input
                  type="text"
                  autoComplete="off"
                  onChange={this.onChangeHanler}
                  name="name"
                  value={this.state.name}
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
            </form>
          </div>
        )
    }
}
export default withRouter(LandingPage)
