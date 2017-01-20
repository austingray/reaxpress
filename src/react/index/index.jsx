import React from 'react';
import ReactDOM from 'react-dom';
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

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <Index />,
    document.getElementById('app'),
  );
}

export default Index;
