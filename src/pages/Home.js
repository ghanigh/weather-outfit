import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchWeatherByCity } from '../utils/api';

const Home = () => {
  const [weather, setWeather] = useState(null);
  const [outfit, setOutfit] = useState('');
  const [city, setCity] = useState('');
  const [showCities, setShowCities] = useState(false);
  const [userLocation, setUserLocation] = useState('');
  const [gender, setGender] = useState('');
  const [style, setStyle] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Liste des villes
  const citiesList = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'];

  // Utilisation de useMemo pour éviter que outfitSuggestions ne change à chaque rendu
  const outfitSuggestions = useMemo(() => ({
    male: {
      casual: ['T-shirt et jean', 'Chemise à manches courtes et short', 'Pull léger et pantalon', 'Veste en cuir et t-shirt'],
      formal: ['Costume complet', 'Chemise et pantalon habillé', 'Veste et cravate'],
    },
    female: {
      casual: ['Robe d’été', 'T-shirt et jupes', 'Pull léger et leggings'],
      formal: ['Robe de soirée', 'Blouse et pantalon habillé', 'Jupe et chemisier'],
    },
  }), []);

  // Fonction pour suggérer une tenue
  const suggestOutfit = useCallback((temperature, condition) => {
    if (gender && style) {
      const suggestions = outfitSuggestions[gender][style];
      const randomOutfit = suggestions[Math.floor(Math.random() * suggestions.length)];
      setOutfit(randomOutfit);
    } else {
      // Suggestions basées sur la météo
      if (condition === 'Rain') {
        setOutfit('Porte un manteau imperméable et prends un parapluie.');
      } else if (condition === 'Clear' && temperature > 20) {
        setOutfit('Il fait chaud et ensoleillé. Un t-shirt et un short sont parfaits.');
      } else if (temperature <= 10) {
        setOutfit('Il fait froid ! Porte un manteau épais et des vêtements chauds.');
      } else {
        setOutfit('Une tenue légère mais avec une veste au cas où.');
      }
    }
  }, [gender, style, outfitSuggestions]);

  // Récupération de la météo et localisation
  useEffect(() => {
    const getWeather = async (city) => {
      try {
        const data = await fetchWeatherByCity(city);
        if (data && data.main) {
          setWeather(data);
          if (isSubmitted) {
            suggestOutfit(data.main.temp, data.weather[0]?.main);
          }
        } else {
          console.error("Données météo non valides :", data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données météo:', error);
      }
    };

    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=30ac6e4dd0c4c9c3cb15980c1415963b&lang=fr&units=metric`);
              const data = await response.json();
              if (data && data.main) {
                setUserLocation(data.name);
                setCity(data.name);
                setWeather(data);
                if (isSubmitted) {
                  suggestOutfit(data.main.temp, data.weather[0]?.main);
                }
              } else {
                console.error("Données météo non valides :", data);
                getWeather('Paris');
              }
            } catch (error) {
              console.error('Erreur lors de la récupération de la localisation:', error);
              getWeather('Paris');
            }
          },
          (error) => {
            console.error('Erreur de localisation:', error);
            getWeather('Paris');
          }
        );
      } else {
        console.log('La géolocalisation n\'est pas supportée par ce navigateur.');
        getWeather('Paris');
      }
    };

    getLocation();
  }, [isSubmitted, suggestOutfit]);

  // Fonction pour gérer le clic sur une ville
  const handleCityClick = (cityName) => {
    setCity(cityName);
    setShowCities(false);
    fetchWeatherByCity(cityName).then(data => {
      if (data && data.main) {
        setWeather(data);
        if (isSubmitted) {
          suggestOutfit(data.main.temp, data.weather[0]?.main);
        }
      } else {
        console.error("Données météo non valides pour la ville sélectionnée :", data);
      }
    }).catch(error => {
      console.error('Erreur lors de la récupération de la météo pour la ville sélectionnée:', error);
    });
  };

  // Fonction pour gérer le clic sur "Ma position"
  const handleUserLocationClick = () => {
    setCity(userLocation);
    fetchWeatherByCity(userLocation).then(data => {
      if (data && data.main) {
        setWeather(data);
        if (isSubmitted) {
          suggestOutfit(data.main.temp, data.weather[0]?.main);
        }
      } else {
        console.error("Données météo non valides pour la position de l'utilisateur :", data);
      }
    }).catch(error => {
      console.error('Erreur lors de la récupération de la météo pour la position de l\'utilisateur:', error);
    });
    setShowCities(false);
  };

  // Fonction pour gérer les réponses du questionnaire
  const handleQuestionnaireSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (weather && weather.main) {
      suggestOutfit(weather.main.temp, weather.weather[0]?.main);
    }
  };

  return (
    <div className="home-container">
      <h1>Bienvenue sur Weather Outfit</h1>
      <button onClick={() => setShowCities(!showCities)} className="cities-button">
        Autres villes
      </button>

      {showCities && (
        <div className="cities-list">
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
          <p>Condition : {weather.weather[0]?.description}</p>
        </div>
      ) : (
        <p>Chargement des données météo...</p>
      )}

      {/* Questionnaire pour le genre et le style */}
      <form onSubmit={handleQuestionnaireSubmit}>
        <h3>Questionnaire</h3>
        <label>
          Êtes-vous un homme ou une femme ?
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Sélectionnez</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
        </label>
        <br />
        <label>
          Quel style préférez-vous ?
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="">Sélectionnez</option>
            <option value="casual">Décontracté</option>
            <option value="formal">Formel</option>
          </select>
        </label>
        <br />
        <button type="submit">Soumettre</button>
      </form>

      {isSubmitted && outfit && (
        <div>
          <h3>Suggestion de tenue :</h3>
          <p>{outfit}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
