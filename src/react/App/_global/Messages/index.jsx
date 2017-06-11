import React from 'react';
import PropTypes from 'prop-types';
import Reaxpress from '../../../Reaxpress';
import SingleMessage from './SingleMessage';

@Reaxpress
class Messages extends React.Component {
  render() {
    const messages = this.props.reaxpressData.messages;
    return (
      <section id="messages">
        <div className="container">
          <div className="row">
            <div id="message-container">
              {
                messages.map((message) => {
                  const type = message.type === 'error'
                    ? 'danger'
                    : message.type;
                  return (
                    <SingleMessage type={type} key={message.text} text={message.text} />
                  );
                })
              }
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Messages.defaultProps = {
  reaxpressData: {},
};

Messages.propTypes = {
  reaxpressData: PropTypes.object,
};

export default Messages;
