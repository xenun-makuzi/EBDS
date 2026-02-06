let allDogs = [];

async function initGallery() {
    try {
        const response = await fetch('dogs.json');
        if (!response.ok) throw new Error("Could not load dog data.");
        
        allDogs = await response.json();
        renderPuppies(allDogs);
        
        // Setup Search and Filter Events
        document.getElementById('puppy-search').addEventListener('input', applyFilters);
        
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyFilters();
            });
        });
        
    } catch (error) {
        console.error("Gallery Error:", error);
    }
}

function applyFilters() {
    const searchTerm = document.getElementById('puppy-search').value.toLowerCase();
    const activeStatus = document.querySelector('.filter-btn.active').getAttribute('data-status');

    const filtered = allDogs.filter(dog => {
        const matchesSearch = dog.name.toLowerCase().includes(searchTerm) || 
                              dog.gender.toLowerCase().includes(searchTerm) ||
                              (dog.description && dog.description.toLowerCase().includes(searchTerm));
        
        const matchesStatus = (activeStatus === 'all') || (dog.status === activeStatus);
        
        return matchesSearch && matchesStatus;
    });

    renderPuppies(filtered);
}

function renderPuppies(dogs) {
    const grid = document.getElementById('puppy-grid');
    grid.innerHTML = '';

    if (dogs.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">No puppies found.</p>';
        return;
    }

    dogs.forEach(dog => {
        const card = document.createElement('div');
        card.className = 'puppy-card';
        card.innerHTML = `
            <a href="puppy-detail.html?id=${dog.id}" class="card-img-holder">
                <img src="${dog.images[0]}" alt="${dog.name}">
                <span class="status-badge ${dog.status.toLowerCase()}">${dog.status}</span>
            </a>
            <div class="card-details">
                <h3>${dog.name}</h3>
                <p>${dog.gender} • ${dog.price}</p>
                <a href="puppy-detail.html?id=${dog.id}" class="btn-detail">VIEW DETAILS</a>
            </div>
        `;
        grid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', initGallery);