import React from 'react';
import PropTypes from 'prop-types';
import Reaxpress from '../../Reaxpress';
import Header from '../_global/Header';
import Footer from '../_global/Footer';
import Content from '../_global/Content';

@Reaxpress
class Homepage extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Content>
          Homepage content
        </Content>
        <Footer />
      </div>
    );
  }
}

Homepage.defaultProps = {
  reaxpressData: {},
};

Homepage.propTypes = {
  reaxpressData: PropTypes.object,
};

export default Homepage;
