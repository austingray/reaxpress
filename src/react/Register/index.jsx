import React from 'react';
import Reaxpress from '../_global/Reaxpress';
import Header from '../_global/Header';
import Footer from '../_global/Footer';
import Content from '../_global/Content';

@Reaxpress
class Register extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Content>
          <h1>Register</h1>
          <form role="form" action="/register" method="post" className="credential-box">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input className="form-control" type="text" name="username" placeholder="Username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input className="form-control" type="password" name="password" placeholder="Password" />
            </div>
            <div className="form-group">
              <label htmlFor="passwordAgain">Password Again</label>
              <input className="form-control" type="password" name="passwordAgain" placeholder="Password Again" />
            </div>
            <div className="form-group">
              <input className="btn btn-primary" type="submit" value="Submit" />
              <a href="/" className="btn btn-link">Cancel</a>
            </div>
          </form>
        </Content>
        <Footer />
      </div>
    );
  }
}

Register.defaultProps = {
  reaxpressData: {},
};

Register.propTypes = {
  reaxpressData: React.PropTypes.object,
};

export default Register;
