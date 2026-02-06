// 1. Mobile Menu Toggle Logic
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');

if (menu) {
    menu.addEventListener('click', () => {
        menu.classList.toggle('is-active');
        menuLinks.classList.toggle('active');
    });
}

// 2. JSON Fetching & Rendering for the Homepage
const puppyGrid = document.querySelector('#puppy-grid');

async function loadPuppies() {
    // Check if we are on the homepage (where the grid exists)
    if (!puppyGrid) return; 

    try {
        // Fetch the 30 dogs from your JSON file
        const response = await fetch('dogs.json');
        const data = await response.json();
        
        // Filter: Only show dogs where "featured": true
        const featuredDogs = data.filter(dog => dog.featured === true);
        
        renderPuppies(featuredDogs);
    } catch (error) {
        console.error('Error loading the kennel data:', error);
        puppyGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">Puppies arriving soon! Please check back later.</p>`;
    }
}

function renderPuppies(dogs) {
    puppyGrid.innerHTML = ''; // Clear loading state

    dogs.forEach(dog => {
        const card = document.createElement('div');
        card.className = 'puppy-card';
        
        // We use dog.images[0] for the main card display
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${dog.images[0]}" alt="${dog.name}" loading="lazy">
                <span class="badge ${dog.status.toLowerCase()}">${dog.status}</span>
            </div>
            <div class="card-info">
                <h3>${dog.name}</h3>
                <p class="parentage">${dog.parentage}</p>
                <div class="card-meta">
                    <span>${dog.gender}</span>
                    <span class="price">${dog.price}</span>
                </div>
                <a href="puppy-detail.html?id=${dog.id}" class="btn-card">View Details</a>
            </div>
        `;
        puppyGrid.appendChild(card);
    });
}

// Fire the function when the page loads
document.addEventListener('DOMContentLoaded', loadPuppies);
// FAQ Accordion Logic
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        
        // Close other items (optional - remove if you want multiple open)
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) item.classList.remove('active');
        });

        faqItem.classList.toggle('active');
    });
});