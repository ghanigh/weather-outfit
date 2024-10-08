import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Bienvenue sur Weather Outfit</h1>
      <p>Gérez vos vêtements et obtenez des suggestions de tenues en fonction de la météo.</p>
      <Link to="/add-clothing">
        <button>Ajouter un vêtement</button>
      </Link>
    </div>
  );
};

export default Home;
