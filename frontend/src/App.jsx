import { Routes, Route } from 'react-router-dom';

import Home from '../Pages/Home';

import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
    </Routes>
  );
};

export default App;
