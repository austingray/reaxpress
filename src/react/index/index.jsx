import React from 'react';
import ReactDOM from 'react-dom';

import Header from '../global/Header';
import Footer from '../global/Footer';
import Page from '../global/Page';

function Index() {
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

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <Index />,
    document.getElementById('app'),
  );
}

export default Index;
