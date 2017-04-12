import validator from 'validator';
import React from 'react';
import Reaxpress from '../../../_global/Reaxpress';
import Header from '../../../_global/Header';
import Footer from '../../../_global/Footer';
import Content from '../../../_global/Content';

@Reaxpress
class AdminPagesUpdate extends React.Component {
  render() {
    const page = this.props.reaxpressData.page;
    const content = typeof page.content === 'undefined'
      ? ''
      : validator.unescape(page.content);
    return (
      <div>
        <Header />
        <Content>
          <h1>
            {
              typeof page.title === 'undefined'
                ? 'Create Page'
                : 'Update Page'
            }
          </h1>
          <form role="form" method="post" className="admin-form">
            {
              typeof page.id !== 'undefined'
                ? (
                  <div className="form-group">
                    <label htmlFor="id">Page ID</label>
                    <input className="form-control" type="text" readOnly name="id" value={page.id || ''} />
                  </div>
                )
                : ''
            }
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input className="form-control" type="text" name="title" defaultValue={page.title || ''} />
            </div>
            <div className="form-group">
              <label htmlFor="slug">Slug</label>
              <input className="form-control" type="text" name="slug" defaultValue={page.slug || ''} />
            </div>
            <div className="form-group">
              <label htmlFor="passwordAgain">Content</label>
              <textarea className="form-control" name="content" rows="20" defaultValue={content || ''} />
            </div>
            <div className="form-group">
              <input className="btn btn-primary" type="submit" value="Submit" />
              <a href="/admin/pages" className="btn btn-link">Cancel</a>
            </div>
          </form>
        </Content>
        <Footer />
      </div>
    );
  }
}

AdminPagesUpdate.defaultProps = {
  reaxpressData: {},
};

AdminPagesUpdate.propTypes = {
  reaxpressData: React.PropTypes.object,
};

export default AdminPagesUpdate;
