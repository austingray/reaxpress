const React = require('react');

function Footer() {
  return (
    <footer id="footer">
      <div className="container">
        <div className="row">
          <div className="col-xs-3">
            Reaxpress &copy; {new Date().getFullYear()}
          </div>
          <div className="col-xs-9">
            <div className="footer-menu">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="https://github.com/austingray/reaxpress">Github</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
