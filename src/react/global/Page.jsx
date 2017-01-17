/* eslint "react/prop-types": 0 */
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

export default Page;
