const API_KEY = 'eb1741142d9a3b9ecbfacde1aa253a51';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// Exemplu de mapare ID-uri pentru Oscar 2026 (ID-urile sunt fictive pentru exemplu, trebuie verificate pe TMDB)
const oscar2026Movies = [
    { id: 1072790, noms: 15, cat: 'Sinners' }, 
    { id: 933260, noms: 12, cat: 'One Battle After Another' },
    { id: 1125510, noms: 7, cat: 'Frankenstein' }
];

document.addEventListener('DOMContentLoaded', () => {
    initYearSelector();
    loadOscarContent(2026);
});

function initYearSelector() {
    const container = document.getElementById('year-selector');
    for (let year = 2026; year >= 2020; year--) {
        const pill = document.createElement('div');
        pill.className = `year-pill ${year === 2026 ? 'active' : ''}`;
        pill.innerText = year;
        pill.onclick = () => {
            document.querySelectorAll('.year-pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            loadOscarContent(year);
        };
        container.appendChild(pill);
    }
}

async function loadOscarContent(year) {
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="row-container"><h2 class="row-title">Se încarcă filmele Oscar ' + year + '...</h2></div>';

    // Preluăm filmele populare din anul respectiv
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&primary_release_year=${year}&sort_by=popularity.desc`);
    const data = await response.json();

    displayMovies(data.results, "Trending Oscar " + year);
}

function displayMovies(movies, title) {
    const main = document.getElementById('main-content');
    main.innerHTML = ''; // Curățăm ecranul

    const section = document.createElement('section');
    section.className = 'row-container';
    section.innerHTML = `<h2 class="row-title">${title}</h2>`;

    const grid = document.createElement('div');
    grid.className = 'movie-grid';

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        
        // Verificăm dacă e în lista noastră de nominalizări
        const oscarInfo = oscar2026Movies.find(m => m.id === movie.id);
        const nomBadge = oscarInfo ? `<div class="movie-badge">${oscarInfo.noms} NOMS</div>` : '';

        card.innerHTML = `
            ${nomBadge}
            <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
        `;
        
        card.onclick = () => showDetails(movie.id);
        grid.appendChild(card);
    });

    section.appendChild(grid);
    main.appendChild(section);
}

async function showDetails(movieId) {
    const modal = document.getElementById('movie-details-modal');
    const body = document.getElementById('modal-body');
    modal.style.display = 'block';
    body.innerHTML = 'Se încarcă...';

    const resp = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`);
    const movie = await resp.json();

    body.innerHTML = `
        <div class="movie-details-content" style="padding: 50px; display: flex; gap: 30px; flex-wrap: wrap;">
            <img src="${IMG_URL + movie.poster_path}" style="width: 300px; border-radius: 12px;">
            <div style="flex: 1; min-width: 300px;">
                <h1>${movie.title} (${movie.release_date.split('-')[0]})</h1>
                <p style="margin: 20px 0; color: #ccc;">${movie.overview}</p>
                <h3>Actori principali:</h3>
                <div style="display: flex; gap: 15px; overflow-x: auto; padding: 20px 0;">
                    ${movie.credits.cast.slice(0, 6).map(actor => `
                        <div style="text-align: center; min-width: 100px;">
                            <img src="${IMG_URL + actor.profile_path}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
                            <p style="font-size: 0.8rem; margin-top: 5px;">${actor.name}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Închidere modal
document.querySelector('.close-modal').onclick = () => {
    document.getElementById('movie-details-modal').style.display = 'none';
};