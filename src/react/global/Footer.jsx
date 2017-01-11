const React = require('react');

function Footer() {
  return (
    <footer id="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            Reaxpress, LLC &copy; {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
