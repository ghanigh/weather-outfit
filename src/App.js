import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // Assurez-vous que le chemin est correct
import AddClothing from './pages/AddClothing'; // Assurez-vous que le chemin est correct
import './App.css'; // Assurez-vous que le fichier CSS est bien importé

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-clothing" element={<AddClothing />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
