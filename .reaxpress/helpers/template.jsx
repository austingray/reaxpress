module.exports = {
  component: (name) => {
    const componentName = name.charAt(0).toUpperCase() + name.slice(1);
    return (
`import React from 'react';
import ReactDOM from 'react-dom';
import Reaxpress from '../_global/Reaxpress';
import Header from '../_global/Header';
import Footer from '../_global/Footer';
import Content from '../_global/Content';

@Reaxpress
class ${componentName} extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <Content>
          ${componentName} content
        </Content>
        <Footer />
      </div>
    );
  }
}

${componentName}.defaultProps = {
  reaxpressData: {},
};

${componentName}.propTypes = {
  reaxpressData: React.PropTypes.object,
};

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <${componentName} />,
    document.getElementById('app'),
  );
}

export default ${componentName};
`
    );
  },

  route: (name) => {
    const componentName = name.charAt(0).toUpperCase() + name.slice(1);
    return (
`import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import ${componentName} from '../src/react/${componentName}';

const router = express.Router();

router.get('/', (req, res) => {
  const reaxpressData = JSON.parse(res.locals.reaxpressData);
  res.render('template.ejs', {
    templateHtml: ReactDOMServer.renderToString(<${componentName} reaxpressData={reaxpressData} />),
    componentJs: '${name}',
  });
});

module.exports = router;
`
    );
  },
};
