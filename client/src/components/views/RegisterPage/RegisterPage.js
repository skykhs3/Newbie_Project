import React, { useState } from 'react'
import {useDispatch} from 'react-redux'
import {registerUser} from '../../../_actions/user_action'
import {withRouter,Link as RouterLink} from 'react-router-dom'
import Axios from 'axios'

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


function Copyright() {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {'Copyright © '}
        <Link color="inherit" href="https://sparcs.org/">
          SPARCS
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

function RegisterPage(props) {

    const dispatch = useDispatch()
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [FirstName, setFirstName] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("");
    const [LastName, setLastName] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }
    const onFirstNameHandler=(event)=>{
        setFirstName(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    const onConfirmPasswordHandler=(event)=>{
        setConfirmPassword(event.currentTarget.value);
    }
    const onLastNameHandler =(event)=>{
        setLastName(event.currentTarget.value);
    }

    const onSubmitHandler=(event)=>{
        event.preventDefault();
        if(Password!==ConfirmPassword){
            return alert("비밀번호와 비밀번호 확인은 같아야합니다.")
        }
        let body={
            email:Email,
            password:Password,
            name:FirstName+LastName
        }
    
        dispatch(registerUser(body)).then((response)=>{
            if(response.payload.success){
                props.history.push('/login')
            }
            else{
                alert("Unexpected Err")
            }
        })
    }
    // return (
    //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
    //         <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>
    //             <label>Email</label>
    //             <input type="email" value={Email} onChange={onEmailHandler} />
    //             <label>Name</label>
    //             <input type="Name" value={Name} onChange={onNameHandler} />
    //             <label>Password</label>
    //             <input type="password" value={Password} onChange={onPasswordHandler} />
    //             <label>Confirm Password</label>
    //             <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
    //             <br />
    //             <button>
    //                 Register
    //             </button>
    //         </form>
    //     </div>
    // )
    const classes = useStyles();
    return (
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} onSubmit={onSubmitHandler}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    onChange={onFirstNameHandler}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    onChange={onLastNameHandler}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    type="email"
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={onEmailHandler}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={onPasswordHandler}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Confirm Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={onConfirmPasswordHandler}
                  />
                </Grid>
             
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <RouterLink to="/login" variant="body2">
                    Already have an account? Sign in
                  </RouterLink>
                </Grid>
              </Grid>
            </form>
          </div>
          <Box mt={5}>
            <Copyright />
          </Box>
        </Container>
      );
}

//withRouter 써야함
export default withRouter(RegisterPage)
