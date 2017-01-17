import React from 'react';
import ReactDOM from 'react-dom';
import Reaxpress from '../reaxpress';

import Header from '../global/Header';
import Footer from '../global/Footer';
import Page from '../global/Page';

@Reaxpress
class Index extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Page>
          Index content
        </Page>
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
