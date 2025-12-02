import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Pledge from './pages/Pledge';
import Quiz from './pages/Quiz';
import Proof from './pages/Proof';
import Cheer from './pages/Cheer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Pledge />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="proof" element={<Proof />} />
          <Route path="cheer" element={<Cheer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
