import React,{useEffect} from 'react'
import axios from 'axios'
import {withRouter} from 'react-router-dom'
import { Link } from "react-router-dom"
import "./LandingPage.css"
import { Message } from '@material-ui/icons'
import socketIOClient from "socket.io-client";
import {useDispatch} from 'react-redux'
import {auth} from '../../../_actions/user_action';

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
            nickName:'',
            name:"",
            value:"",
            messageList:[],
        }
    }
    componentDidMount(){
      //  const dispatch=useDispatch();
      socket.emit('reset',);
        socket.on('receive message', (res) => {
          console.log("Receive msg");
          console.log(res);
          this.setState({messageList:res});
        // / this.messageList=
        });
        const data=axios.get('/api/users/auth').then(response=>response.data);
        data.then(res=>{this.setState({email:res.email,name:res.name});})
    }

    onSubmitHandler=(e)=>{
      e.preventDefault();
      socket.emit('send message', { name: this.state.name, message: this.state.value,email:this.state.email });
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
    
    render(){
        return (
            <div className="App">
            <section className="chat-list">
                  <div className="message">
        <p className="username">User Email : {this.state.email}</p>
                    <p className="message-text">User Name : {this.state.name}</p>
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
              <div>
      {this.state.messageList.map(function(d, idx){
         return (<li key={idx}>{d.name} : {d.content}</li>)
       })}
      </div>
            </form>
          </div>
        )
    }
}
export default withRouter(LandingPage)
