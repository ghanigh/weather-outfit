export const getMovieTrailer = async (movieId) => {
    const apiKey = process.env.REACT_APP_MOVIE_DB_API_KEY; // Utiliser la clé API depuis le fichier .env
    const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP ! statut : ${response.status}`);
        }
        const data = await response.json();
        // Trouver la première vidéo de type 'Trailer'
        const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        return trailer ? trailer.key : null;
    } catch (error) {
        console.error('Erreur lors de la récupération de la bande-annonce:', error);
        return null; // Retourner null en cas d'erreur
    }
};
