import React from 'react';
import './Compose.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const styles = {

  largeIcon: {
    width: 60,
    height: 60,
  },

};
export default class Compose extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.value);
  }
  onTest=(event)=>{
    console.log(event.target.value);
  }


  render(){
    return (
      <div className="compose">
        <form onSubmit={this.props.onSubmit}>
        <TextField
        onKeyUp={this.props.onKeyUpHandler}
        onKeyDown={this.props.onKeyDownHandler}
        multiline={true}
        rows={1}
    rowsMax={4}
          type="text"
          className="compose-input"re
          placeholder="Type a message"
              variant="outlined"
         //     margin="normal"
              required

              autoFocus
              name="value"
              value={this.props.message}
            //  value={this.props.value}
              onChange={this.props.onChange}
        />
        <div className="sizedBox"></div>
    <Button
    className="button"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              display="inline"
          
          
            ><div style={{color:"white"}}>Send</div>
            </Button> 
            </form> 
      </div>
    );
  }
}