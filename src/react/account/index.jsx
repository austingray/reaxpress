import React from 'react';
import ReactDOM from 'react-dom';
import Reaxpress from '../reaxpress';

import Header from '../global/Header';
import Footer from '../global/Footer';
import Page from '../global/Page';

@Reaxpress
class Account extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Page>
          <h1>Welcome, {this.props.reaxpressData.user.username}</h1>
          <p>We&apos;ve been expecting you.</p>
        </Page>
        <Footer />
      </div>
    );
  }
}

Account.defaultProps = {
  reaxpressData: {},
};

Account.propTypes = {
  reaxpressData: React.PropTypes.object,
};

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <Account />,
    document.getElementById('app'),
  );
}

export default Account;
