import React from 'react';
import PropTypes from 'prop-types';
import Reaxpress from '../../Reaxpress';
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
  reaxpressData: PropTypes.object,
};

export default Account;
