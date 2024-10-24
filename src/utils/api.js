const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // Utiliser la clé API depuis le fichier .env

export const fetchWeatherByCity = (city) => {
    return fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP ! statut : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            return data; // Retourner les données météo
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des données météo:', error);
            return null; // Retourner null en cas d'erreur
        });
};
