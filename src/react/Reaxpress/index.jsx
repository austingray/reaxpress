/* eslint react/prop-types: 0, max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

function Reaxpress(ReaxpressComponent) {
  class ReaxpressComponentWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.mounted = false;
      this.handleDataChange = this.handleDataChange.bind(this);
      this.state = {};
    }
    getChildContext() {
      if (Object.keys(this.props.reaxpressData).length === 0 && this.props.reaxpressData.constructor === Object) {
        return {};
      }
      return { reaxpressData: this.props.reaxpressData };
    }
    componentDidMount() {
      this.mounted = true;
      window.reaxpress.addDataListener(this.handleDataChange);
    }
    componentWillUnmount() {
      this.mounted = false;
    }
    handleDataChange(reaxpressData) {
      if (this.mounted) {
        this.setState({
          reaxpressData,
        });
      }
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
    reaxpressData: PropTypes.object,
  };
  ReaxpressComponentWrapper.childContextTypes = {
    reaxpressData: PropTypes.object,
  };
  return ReaxpressComponentWrapper;
}

export default Reaxpress;
