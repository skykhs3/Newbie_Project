import Axios from 'axios';
import React,{useEffect}from 'react';
import {useDispatch} from 'react-redux'
import {auth} from '../_actions/user_action';


export default function(SpecificComponent,option,adminRoute=null){

    function AuthenticationCheck(props){
        const dispatch=useDispatch();
        useEffect(() => {

            dispatch(auth()).then(response=>{
                //adminRoute가 true 홈페이지는 무조건 접근 가능, false면 무조건 접근 불가능
               
                if(!response.payload.isAuth){/// 로그인 안한 상태
                    if(option){
                        props.history.push('/login')
                    }
                } /// 로그인 한 상태
                else{
                   if(!option){
                       props.history.push('/')
                   }
                }
        
            })
          
        }, [])
        return(<SpecificComponent/>)
    }

    return AuthenticationCheck
}