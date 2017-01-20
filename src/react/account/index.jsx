import React from 'react';
import ReactDOM from 'react-dom';
import Reaxpress from '../_global/Reaxpress';
import Header from '../_global/Header';
import Footer from '../_global/Footer';
import Content from '../_global/Content';

@Reaxpress
class Account extends React.Component {
  render() {
    const user = this.props.reaxpressData.user;
    return (
      <div>
        <Header />
        <Content>
          <h1>Welcome, {user.username}</h1>
          {
            user.role > 1
              ? (
                <p>
                  You must be pretty important around here. <a href="/admin">Admin panel</a>.
                </p>
              )
              : <p>We&apos;ve been expecting you.</p>
          }
        </Content>
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
