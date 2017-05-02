/* eslint react/no-danger: 0 */
import validator from 'validator';
import React from 'react';
import Reaxpress from '../../../Reaxpress';
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
          {
            typeof page === 'undefined'
              ? null
              : (
                <div>
                  <h1>{page.title}</h1>
                  <div className="page-content" dangerouslySetInnerHTML={{ __html: validator.unescape(page.content) }} />
                </div>
              )
          }
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

export default Page;
