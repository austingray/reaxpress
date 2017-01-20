/* eslint react/no-danger: 0 */
import validator from 'validator';
import React from 'react';
import ReactDOM from 'react-dom';

import Reaxpress from '../Reaxpress';
import Header from '../Header';
import Footer from '../Footer';
import Content from '../Content';

@Reaxpress
class Page extends React.Component {
  render() {
    const page = this.props.reaxpressData.page;
    return (
      <div>
        <Header />
        <Content>
          <h1>{page.title}</h1>
          <div className="page-content" dangerouslySetInnerHTML={{ __html: validator.unescape(page.content) }} />
        </Content>
        <Footer />
      </div>
    );
  }
}

Page.defaultProps = {
  reaxpressData: {},
};

Page.propTypes = {
  reaxpressData: React.PropTypes.object,
};

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <Page />,
    document.getElementById('app'),
  );
}

export default Page;
