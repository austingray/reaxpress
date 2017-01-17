import React from 'react';
import Reaxpress from '../reaxpress';

@Reaxpress
class Header extends React.Component {
  render() {
    return (
      <header id="header">
        <div className="container">
          <div className="row">
            <div className="col-md-9">
              <div className="logo">
                <a href="/">Reaxpress</a>
              </div>
            </div>
            <div className="col-md-3">
              {
                this.props.reaxpressData.user
                  ? 'Logged in'
                  : 'Not logged in'
              }
            </div>
          </div>
        </div>
      </header>
    );
  }
}

Header.defaultProps = {
  reaxpressData: {},
};

Header.propTypes = {
  reaxpressData: React.PropTypes.object,
};

export default Header;
