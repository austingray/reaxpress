import React from 'react';
import ReactDOM from 'react-dom';
import Reaxpress from '../reaxpress';

import Header from '../global/Header';
import Footer from '../global/Footer';
import Page from '../global/Page';

@Reaxpress
class Admin extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Page>
          Admin content
        </Page>
        <Footer />
      </div>
    );
  }
}

Admin.defaultProps = {
  reaxpressData: {},
};

Admin.propTypes = {
  reaxpressData: React.PropTypes.object,
};

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <Admin />,
    document.getElementById('app'),
  );
}

export default Admin;
