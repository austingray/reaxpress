import React from 'react';
import ReactDOM from 'react-dom';
import Reaxpress from '../../_global/Reaxpress';
import Header from '../../_global/Header';
import Footer from '../../_global/Footer';
import Content from '../../_global/Content';

@Reaxpress
class AdminPages extends React.Component {
  render() {
    const pages = this.props.reaxpressData.pages;
    return (
      <div>
        <Header />
        <Content>
          <h1>Pages</h1>
          <p>
            <a href="/admin/pages/new" className="btn btn-primary">Create New Page</a>
          </p>
          <table className="table">
            <thead className="thead-inverse">
              <tr>
                <th>#</th>
                <th>Slug</th>
                <th>Title</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {
                pages.map(page =>
                  <tr key={page.id}>
                    <td>{page.id}</td>
                    <td>{page.slug}</td>
                    <td>{page.title}</td>
                    <td><a className="btn btn-default" href={`/admin/pages/${page.id}`}>Edit</a></td>
                  </tr>,
                )
              }
            </tbody>
          </table>
        </Content>
        <Footer />
      </div>
    );
  }
}

AdminPages.defaultProps = {
  reaxpressData: {},
};

AdminPages.propTypes = {
  reaxpressData: React.PropTypes.object,
};

if (typeof document !== 'undefined') {
  console.log(window.location.pathname);
  ReactDOM.render(
    <AdminPages />,
    document.getElementById('app'),
  );
}

export default AdminPages;
