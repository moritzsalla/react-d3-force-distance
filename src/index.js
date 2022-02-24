import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import ReactiveSVGCanvas from './components/ReactiveSVGCanvas';

const rootElement = document.getElementById('root');

ReactDOM.render(
  <StrictMode>
    <ReactiveSVGCanvas />
  </StrictMode>,
  rootElement
);
