import React from 'react';
import ReactDOM from 'react-dom';
import Reaxpress from '../reaxpress';

import Header from '../global/Header';
import Footer from '../global/Footer';
import Page from '../global/Page';

@Reaxpress
class ErrorTemplate extends React.Component {
  render() {
    const page = this.props.reaxpressData.page;
    return (
      <div>
        <Header />
        <Page>
          <h1>{page.title}</h1>
          <p>{page.body}</p>
        </Page>
        <Footer />
      </div>
    );
  }
}

ErrorTemplate.defaultProps = {
  reaxpressData: {},
};

ErrorTemplate.propTypes = {
  reaxpressData: React.PropTypes.object,
};

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <ErrorTemplate />,
    document.getElementById('app'),
  );
}

export default ErrorTemplate;
