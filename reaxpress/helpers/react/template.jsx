module.exports = component =>
`import React from 'react';
import ReactDOM from 'react-dom';
import Reaxpress from '../_global/Reaxpress';
import Header from '../_global/Header';
import Footer from '../_global/Footer';
import Content from '../_global/Content';

@Reaxpress
class ${component} extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Content>
          ${component} content
        </Content>
        <Footer />
      </div>
    );
  }
}

${component}.defaultProps = {
  reaxpressData: {},
};

${component}.propTypes = {
  reaxpressData: React.PropTypes.object,
};

export default ${component};`;
