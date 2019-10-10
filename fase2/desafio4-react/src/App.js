import React, { Fragment } from 'react';
import './App.css';
import Header from './components/Header';
import Post from './components/Post';

function App() {
  const posts = [1, 2];
  return (
    <Fragment>
      <Header />
      {posts.map(post => (
        <Post />
      ))}
    </Fragment>
  );
}

export default App;
