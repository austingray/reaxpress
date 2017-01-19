import React from 'react';
import ReactDOM from 'react-dom';
import Reaxpress from '../reaxpress';

import Header from '../global/Header';
import Footer from '../global/Footer';
import Page from '../global/Page';

@Reaxpress
class Login extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Page>
          <h1>Login</h1>
          <form role="form" action="/login" method="post" className="credential-box">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input className="form-control" type="text" name="username" placeholder="Username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input className="form-control" type="password" name="password" placeholder="Password" />
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

Login.defaultProps = {
  reaxpressData: {},
};

Login.propTypes = {
  reaxpressData: React.PropTypes.object,
};

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <Login />,
    document.getElementById('app'),
  );
}

export default Login;
