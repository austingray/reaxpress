import React from 'react';
import ReactDOM from 'react-dom';
import Router from '../Reaxpress/Router';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleUrlChange = this.handleUrlChange.bind(this);
    const path = window.location.pathname;
    this.state = {
      path,
    };
  }
  componentDidMount() {
    window.reaxpress.mounted = true;
    window.reaxpress.addUrlListener(this.handleUrlChange);
  }
  handleUrlChange(path) {
    this.setState({
      path,
    });
  }
  render() {
    let renderComponent = null;
    Router(this.state.path, (exists, Component) => {
      renderComponent = exists
        ? <Component />
        : null;
    });
    return (
      <div>
        {renderComponent}
      </div>
    );
  }
}

Router(null, (exists) => {
  if (exists) {
    ReactDOM.render(
      <App />,
      document.getElementById('app'),
    );
  }
});
