import React from 'react';

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
  children: React.PropTypes.array,
};

Page.defaultProps = {
  children: 'This is default content.',
};

export default Page;
