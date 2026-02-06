async function loadDetail() {
    const params = new URLSearchParams(window.location.search);
    const dogId = params.get('id');

    if (!dogId) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await fetch('dogs.json');
        if (!response.ok) throw new Error("JSON failed to load");
        
        const dogs = await response.json();
        const dog = dogs.find(d => d.id === dogId);

        if (dog) {
            renderDetail(dog);
            // Call the similar dogs function here
            renderSimilar(dogs, dog); 
        } else {
            document.getElementById('dog-name').innerText = "Puppy not found";
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function renderDetail(dog) {
    // Fill basic info
    document.getElementById('dog-name').innerText = dog.name;
    document.getElementById('dog-price').innerText = dog.price;
    document.getElementById('dog-gender').innerText = dog.gender;
    document.getElementById('dog-status').innerText = dog.status;
    document.getElementById('dog-parentage').innerText = dog.parentage;
    document.getElementById('dog-description').innerText = dog.description;

    const display = document.getElementById('main-display');
    const thumbs = document.getElementById('thumbnails');

    // Main Image
    display.innerHTML = `<img src="${dog.images[0]}" class="fade-in" alt="${dog.name}">`;

    // Thumbnails
    thumbs.innerHTML = '';
    dog.images.forEach((img) => {
        const imgBtn = document.createElement('img');
        imgBtn.src = img;
        imgBtn.onclick = () => {
            display.innerHTML = `<img src="${img}" class="fade-in">`;
        };
        thumbs.appendChild(imgBtn);
    });

    // Video Button
    if (dog.video) {
        const vidBtn = document.createElement('div');
        vidBtn.className = "video-thumb";
        vidBtn.innerHTML = "<span>PLAY VIDEO</span>";
        vidBtn.onclick = () => {
            display.innerHTML = `
                <video controls autoplay class="fade-in">
                    <source src="${dog.video}" type="video/mp4">
                </video>`;
        };
        thumbs.appendChild(vidBtn);
    }
    // Inside renderDetail function
const reserveBtn = document.getElementById('reserve-btn');
reserveBtn.href = `reservation.html?puppy=${encodeURIComponent(dog.name)}&image=${encodeURIComponent(dog.images[0])}&total=${encodeURIComponent(dog.price)}`;
}

function renderSimilar(allDogs, currentDog) {
    const similarGrid = document.getElementById('similar-grid');
    if (!similarGrid) return; // Exit if the ID isn't in your HTML

    similarGrid.innerHTML = '';

    // Logic: Find dogs of same gender OR status, excluding the current one
    let matches = allDogs.filter(d => d.id !== currentDog.id && d.status === "Available");

    // If no available dogs, show any other dogs except the current one
    if (matches.length === 0) {
        matches = allDogs.filter(d => d.id !== currentDog.id);
    }

    // Limit to 3
    const displayDogs = matches.slice(0, 3);

    displayDogs.forEach(dog => {
        const card = document.createElement('div');
        card.className = 'puppy-card';
        card.innerHTML = `
            <div class="card-img-container">
                <img src="${dog.images[0]}" alt="${dog.name}">
                <span class="badge ${dog.status.toLowerCase()}">${dog.status}</span>
            </div>
            <div class="card-info">
                <h3>${dog.name}</h3>
                <p class="parentage">${dog.parentage}</p>
                <a href="puppy-detail.html?id=${dog.id}" class="btn-card">View Details</a>
            </div>
        `;
        similarGrid.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', loadDetail);