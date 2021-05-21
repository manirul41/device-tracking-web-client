import React, { Component } from 'react';

 class LoginError extends Component {
  // constructor(props) {
  //     super(props);
  //     console.log('LoginError.js constructor.');
  // }
  render() {
    return (
      <div className='text-danger'>
        <p>{this.props.loginerror}</p>
      </div>
    );
  }
}

export default LoginError; 
