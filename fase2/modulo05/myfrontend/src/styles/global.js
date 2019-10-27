import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin:0;
    padding:0;
    outline: 0;
    box-sizing: border-box;
  }

  grid-template, body, #root {
    min-height: 100%;
  }

  body {
    background: #7159c1;
    -webkit-font-smoothing: antialiesed !important;
  }

  body, input, button {
    color: #222;
    font-size: 14px;
    font-family: Arial, Helvetica, sans-serif;
  }

  button {
    cursor: pointer;
  }
`;