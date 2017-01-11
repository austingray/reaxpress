import React from 'react';
import ReactDOM from 'react-dom';

function Page({ children }) {
  return (
    <section id="content">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

Page.propTypes = {
  children: React.PropTypes.string,
};

Page.defaultProps = {
  children: 'This is default content.',
};

if (typeof document !== 'undefined') {
  ReactDOM.render(
    <Page />,
    document.getElementById('app'),
  );
}

export default Page;
