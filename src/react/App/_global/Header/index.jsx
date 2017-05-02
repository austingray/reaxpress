import React from 'react';
import PropTypes from 'prop-types';
import Reaxpress from '../../../Reaxpress';

@Reaxpress
class Header extends React.Component {
  render() {
    const user = this.props.reaxpressData.user;
    return (
      <header id="header">
        <section id="header-main">
          <div className="container">
            <div className="row">
              <div className="col-4">
                <div className="logo">
                  <a href="/">Reaxpress</a>
                </div>
              </div>
              <div className="col-8" style={{ textAlign: 'right' }}>
                {
                  user
                    ? (
                      <div>
                        Welcome, <a href="/account">{user.username}</a> <a href="/logout">[logout]</a>
                      </div>
                    )
                    : (
                      <div>
                        <a href="/login" className="btn btn-link">Login</a>
                        <a href="/register" className="btn btn-primary">Register</a>
                      </div>
                    )
                }
              </div>
            </div>
          </div>
        </section>
        <section id="messages" />
      </header>
    );
  }
}

Header.defaultProps = {
  reaxpressData: {},
};

Header.propTypes = {
  reaxpressData: PropTypes.object,
};

export default Header;
