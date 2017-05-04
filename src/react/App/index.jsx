import React from 'react';
import ReactDOM from 'react-dom';
import Router from '../Reaxpress/Router';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.state = {
      path: window.location.pathname,
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
      renderComponent = <Component />;
    });
    return (
      <div>
        {renderComponent}
      </div>
    );
  }
}

// don't bother mounting on admin pages, will not work
// TODO: fix this to make sure we don't catch random paths by accident
if (window.location.pathname.indexOf('admin') < 0) {
  ReactDOM.render(
    <App />,
    document.getElementById('app'),
  );
}

export default App;
