import React, { useState } from 'react';
import axios from 'axios';

const AddClothing = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    season: '',
    material: '',
    color: '',
    image: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/clothing', formData);
      console.log('Vêtement ajouté avec succès : ', response.data);
    } catch (error) {
      console.error('Erreur lors de l’ajout du vêtement :', error);
    }
  };

  return (
    <div>
      <h2>Ajouter un vêtement</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nom du vêtement"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="type"
          placeholder="Type (ex. t-shirt, pantalon)"
          value={formData.type}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="season"
          placeholder="Saison (été, hiver)"
          value={formData.season}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="material"
          placeholder="Matière (coton, laine)"
          value={formData.material}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="color"
          placeholder="Couleur"
          value={formData.color}
          onChange={handleChange}
        />
        <input
          type="text"
          name="image"
          placeholder="URL de l'image (facultatif)"
          value={formData.image}
          onChange={handleChange}
        />
        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AddClothing;
