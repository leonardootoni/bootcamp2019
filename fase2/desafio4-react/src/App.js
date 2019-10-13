import React, { Fragment } from 'react';
import './App.css';

import Header from './components/Header';
import PostContainer from './components/PostContainer';

function App() {
  return (
    <Fragment>
      <Header />
      <PostContainer />
    </Fragment>
  );
}

export default App;
