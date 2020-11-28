import Axios from 'axios';
import React, { useState} from 'react'
import {useDispatch} from 'react-redux'
import {loginUser} from '../../../_actions/user_action'
import {withRouter,Link as RouterLink } from 'react-router-dom'

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import image1 from '../../../images/sparcs_background.png';


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
    root: {
      height: '100vh',
    },
    image: {
      backgroundImage: 'url(data:image/jpeg;base64,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)',
      backgroundRepeat: 'no-repeat',
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    paper: {
      margin: theme.spacing(8, 4),
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
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    
  }))
function LoginPage(props) {
    const dispatch = useDispatch()

    //  props state
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }
    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }
    const onSubmitHandler = (event) => {
        event.preventDefault();

        let body={
            email:Email,
            password:Password
        }
        dispatch(loginUser(body)).then(
            response =>{
                if(response.payload.loginSuccess){
                    props.history.push('/')
                }
                else{
                    alert("Wrong email or password")
                }
            }

        )

    }

    const classes = useStyles();

  return (
   
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>

           <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={onSubmitHandler}>
            <TextField

                type="email"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={onEmailHandler}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onPasswordHandler}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >Sign In
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <RouterLink to="/register" >
                  {"Don't have an account? Sign Up"}
                </RouterLink>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

export default withRouter(LoginPage)
