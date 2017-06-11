import React from 'react';
import PropTypes from 'prop-types';

class SingleMessage extends React.Component {
  render() {
    const type = this.props.type;
    const text = this.props.text;
    const classVal = `alert alert-${type} alert-dismissible fade show`;
    return (
      <div className={classVal} role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        <span dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    );
  }
}

SingleMessage.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default SingleMessage;
