import React, { useState, useEffect } from 'react';
import { fetchWeatherByCity } from '../utils/api';

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [outfit, setOutfit] = useState('');
  const [city, setCity] = useState('');
  const [showCities, setShowCities] = useState(false);
  const [userLocation, setUserLocation] = useState('');

  // Liste des villes (exemple simplifié)
  const citiesList = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'];

  // Fonction pour récupérer la météo
  useEffect(() => {
    const getWeather = async (city) => {
      const data = await fetchWeatherByCity(city);
      if (data) {
        setWeather(data);
        suggestOutfit(data.main.temp, data.weather[0].main);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}&lang=fr&units=metric`);
            const data = await response.json();
            if (data) {
              setUserLocation(data.name); // Met à jour la position de l'utilisateur
              setCity(data.name);
              setWeather(data);
              suggestOutfit(data.main.temp, data.weather[0].main);
            }
          },
          (error) => {
            console.error('Erreur de localisation:', error);
            getWeather('Paris'); // En cas d'erreur, récupère les données pour Paris
          }
        );
      } else {
        console.log('La géolocalisation n\'est pas supportée par ce navigateur.');
        getWeather('Paris'); // En cas d'absence de géolocalisation, récupère les données pour Paris
      }
    };

    getLocation();
  }, []);

  // Fonction pour suggérer une tenue
  const suggestOutfit = (temperature, condition) => {
    if (condition === 'Rain') {
      setOutfit('Porte un manteau imperméable et prends un parapluie.');
    } else if (condition === 'Clear' && temperature > 20) {
      setOutfit('Il fait chaud et ensoleillé. Un t-shirt et un short sont parfaits.');
    } else if (temperature <= 10) {
      setOutfit('Il fait froid ! Porte un manteau épais et des vêtements chauds.');
    } else {
      setOutfit('Une tenue légère mais avec une veste au cas où.');
    }
  };

  // Fonction pour gérer le clic sur une ville
  const handleCityClick = (city) => {
    setCity(city);
    setShowCities(false);
    fetchWeatherByCity(city).then(data => {
      if (data) {
        setWeather(data);
        suggestOutfit(data.main.temp, data.weather[0].main);
      }
    });
  };

  // Fonction pour gérer le clic sur "Ma position"
  const handleUserLocationClick = () => {
    setCity(userLocation);
    fetchWeatherByCity(userLocation).then(data => {
      if (data) {
        setWeather(data);
        suggestOutfit(data.main.temp, data.weather[0].main);
      }
    });
    setShowCities(false); // Ferme la liste après avoir sélectionné "Ma position"
  };

  return (
    <div>
      <h1>Bienvenue sur Weather Outfit</h1>
      <button onClick={() => setShowCities(!showCities)} style={{ position: 'absolute', top: '10px', right: '10px' }}>
        Autres villes
      </button>
      {showCities && (
        <div style={{ position: 'absolute', top: '50px', right: '10px', backgroundColor: 'white', border: '1px solid #ccc', padding: '10px' }}>
          <h3 style={{ cursor: 'pointer' }} onClick={handleUserLocationClick}>
            Ma position : {userLocation}
          </h3>
          <h3>Choisir une ville :</h3>
          <ul>
            {citiesList.map((cityName) => (
              <li key={cityName} onClick={() => handleCityClick(cityName)} style={{ cursor: 'pointer' }}>
                {cityName}
              </li>
            ))}
          </ul>
        </div>
      )}
      {weather ? (
        <div>
          <h2>Météo actuelle à {city} :</h2>
          <p>Température : {weather.main.temp}°C</p>
          <p>Condition : {weather.weather[0].description}</p>
        </div>
      ) : (
        <p>Chargement des données météo...</p>
      )}
      {outfit && (
        <div>
          <h3>Suggestion de tenue :</h3>
          <p>{outfit}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
