import React, { Component } from 'react';
import './PostContainer.css';

import Post from '../Post/index';

class PostContainer extends Component {
  state = {
    posts: [
      {
        id: 1,
        author: {
          name: 'Julio Alcantara',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
        },
        dateInfo: '04 Jun 2019',
        content: 'Vivamus efficitur est sit amet dolor tincidunt sollicitudin?',
        comments: [
          {
            id: 123,
            author: {
              name: 'Goran Mattic',
              avatar: 'https://randomuser.me/api/portraits/men/14.jpg'
            },
            content:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus gravida nisl at mi commodo condimentum. Quisque mattis urna ipsum, non consectetur lacus pretium sed. Aliquam sagittis imperdiet dui id porttitor. Suspendisse sed metus id justo pulvinar finibus in eu odio. Ut luctus congue erat. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean molestie, justo sit amet malesuada fermentum, erat lacus sagittis orci, sed lacinia leo ex sit amet enim. Morbi ac nunc lacus. Morbi massa lorem, imperdiet congue augue vel, aliquam imperdiet est. Sed eget odio et diam scelerisque interdum. Nam aliquam scelerisque luctus. Morbi libero lectus, pretium ac nibh ornare, egestas tempus ligula. Fusce consectetur viverra mauris, at semper felis viverra et. Maecenas et turpis sit amet sapien facilisis dignissim.'
          }
        ]
      },
      {
        id: 2,
        author: {
          name: 'Sarah Jones',
          avatar: 'https://randomuser.me/api/portraits/women/31.jpg'
        },
        dateInfo: '01 Jun 2019',
        content: 'Proin malesuada turpis in mi ultricies?',
        comments: [
          {
            id: 17,
            author: {
              name: 'Mandy Phillips',
              avatar: 'https://randomuser.me/api/portraits/women/79.jpg'
            },
            content:
              'Praesent vitae lectus quis metus mollis tristique. Quisque tincidunt sed magna a vulputate. Nunc accumsan eleifend elit id maximus. Aenean sit amet vestibulum mi. Proin id quam est. Mauris sed purus magna. Proin ut tellus non odio sagittis suscipit sit amet sit amet velit.'
          },
          {
            id: 34,
            author: {
              name: 'Michaela Stwart',
              avatar: 'https://randomuser.me/api/portraits/women/66.jpg'
            },
            content:
              'Maecenas dignissim ipsum non diam efficitur, euismod tristique mauris iaculis. Aenean vestibulum eros vel ipsum viverra sodales. Curabitur luctus volutpat nisl. Phasellus fringilla eleifend consectetur. Phasellus ultrices sem dui, cursus hendrerit mauris porttitor at. Nam hendrerit nunc lectus, eget porttitor felis porta ut. Cras tempus lacinia iaculis. Ut magna quam, vulputate vel leo id, condimentum rhoncus libero.Conteúdo do comentário'
          }
        ]
      }
    ]
  };

  render() {
    return (
      <div className='post-container'>
        {this.state.posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    );
  }
}

export default PostContainer;
