import React from 'react';
import ReactDOM from 'react-dom';
import Reaxpress from '../reaxpress';

import Header from '../global/Header';
import Footer from '../global/Footer';
import Page from '../global/Page';

@Reaxpress
class Register extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Page>
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
        </Page>
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

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <Register />,
    document.getElementById('app'),
  );
}

export default Register;
