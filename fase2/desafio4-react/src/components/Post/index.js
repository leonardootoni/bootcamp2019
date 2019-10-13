import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import './styles.css';
import PostComment from './PostComment';

class Post extends Component {
  render() {
    const post = this.props.post;
    return (
      <div className='post-card'>
        <div className='post-header'>
          <div className='post-header-item'>
            <img src={post.author.avatar}></img>
          </div>
          <div className='post-header-item'>
            <div className='post-header-submitter'>{post.author.name}</div>
            <div className='post-header-submitter-date'>{post.dateInfo}</div>
          </div>
        </div>
        <div>
          {post.content}
          <hr />
        </div>
        <div>
          {post.comments.map(comment => {
            return <PostComment key={comment.id} comment={comment} />;
          })}
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired
    }),
    dateInfo: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired
  }).isRequired
};

export default Post;
