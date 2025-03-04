import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormPage from './components/FormPage';
import BlogEditor from './components/BlogEditor';
import PublishedBlog from './components/PublishedBlog';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/edit" element={<BlogEditor />} />
        <Route path="/published" element={<PublishedBlog />} />
      </Routes>
    </Router>
  );
}

export default App;