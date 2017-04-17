const React = require('react');

function Footer() {
  return (
    <footer id="footer">
      <div className="container">
        <div className="row">
          <div className="col-3">
            Reaxpress &copy; {new Date().getFullYear()}
          </div>
          <div className="col-9">
            <div className="footer-menu">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="https://github.com/austingray/reaxpress">Reaxpress on Github</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
