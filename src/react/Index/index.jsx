import React from 'react';
import Reaxpress from '../_global/Reaxpress';
import Header from '../_global/Header';
import Footer from '../_global/Footer';
import Content from '../_global/Content';

@Reaxpress
class Index extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Content>
          Index content
        </Content>
        <Footer />
      </div>
    );
  }
}

Index.defaultProps = {
  reaxpressData: {},
};

Index.propTypes = {
  reaxpressData: React.PropTypes.object,
};

export default Index;
