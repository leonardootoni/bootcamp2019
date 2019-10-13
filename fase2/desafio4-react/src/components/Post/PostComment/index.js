import React, { Component } from 'react';
import './styles.css';

import PropTypes from 'prop-types';

class PostComment extends Component {
  render() {
    const comment = this.props.comment;
    return (
      <div className='comment-header'>
        <div className='comment-header-item'>
          <img src={comment.author.avatar} />
        </div>
        <div className='comment-balloon'>
          <strong>{comment.author.name}</strong>
          <p>{comment.content}</p>
        </div>
      </div>
    );
  }
}

PostComment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number,
    author: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired
    }),
    content: PropTypes.string.isRequired
  })
};

export default PostComment;
