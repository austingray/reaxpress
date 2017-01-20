/* eslint react/prop-types: 0, max-len: 0 */
import React from 'react';

function Reaxpress(ReaxpressComponent) {
  class ReaxpressComponentWrapper extends React.Component {
    getChildContext() {
      if (Object.keys(this.props.reaxpressData).length === 0 && this.props.reaxpressData.constructor === Object) {
        return {};
      }
      return { reaxpressData: this.props.reaxpressData };
    }
    render() {
      let reaxpressData = {};
      if (typeof window === 'undefined') {
        reaxpressData = typeof this.context.reaxpressData === 'undefined'
          ? this.props.reaxpressData
          : this.context.reaxpressData;
      } else {
        reaxpressData = window.reaxpressData;
      }
      return <ReaxpressComponent {...this.props} reaxpressData={reaxpressData} />;
    }
  }
  ReaxpressComponentWrapper.contextTypes = {
    reaxpressData: React.PropTypes.object,
  };
  ReaxpressComponentWrapper.childContextTypes = {
    reaxpressData: React.PropTypes.object,
  };
  return ReaxpressComponentWrapper;
}

export default Reaxpress;
