/* eslint class-methods-use-this: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import Reaxpress from '../../_global/Reaxpress';
import Header from '../../_global/Header';
import Footer from '../../_global/Footer';
import Content from '../../_global/Content';

@Reaxpress
class AdminPages extends React.Component {
  deletePage(id) {
    $.ajax({
      method: 'DELETE',
      url: `/admin/pages/${id}`,
      success(redirectUrl) {
        window.location.href = redirectUrl;
      },
    });
  }
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
                <th>Title</th>
                <th>Slug</th>
                <th>View/Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {
                pages.map(page =>
                  <tr key={page.id}>
                    <td>{page.id}</td>
                    <td>{page.title}</td>
                    <td>{page.slug}</td>
                    <td>
                      <a className="btn btn-default" href={`/${page.slug}`}>View</a>
                      &nbsp;
                      <a className="btn btn-primary" href={`/admin/pages/${page.id}`}>Edit</a>
                    </td>
                    <td>
                      <form onSubmit={(e) => { e.preventDefault(); this.deletePage(page.id); }}>
                        <input type="hidden" value={page.id} />
                        <button className="btn btn-danger">Delete</button>
                      </form>
                    </td>
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
