import React from 'react';
import ReactDOM from 'react-dom';
import Reaxpress from '../_global/Reaxpress';
import Header from '../_global/Header';
import Footer from '../_global/Footer';
import Content from '../_global/Content';

@Reaxpress
class Admin extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Content>
          <h1>Admin</h1>
          <ul>
            <li><a href="/admin/pages">Pages</a></li>
          </ul>
        </Content>
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
