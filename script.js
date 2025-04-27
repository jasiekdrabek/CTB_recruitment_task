// Get references to DOM elements
const gallery = document.getElementById('photo-gallery');
const loader = document.getElementById('loader');
const errorDiv = document.getElementById('error');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const pageNumber = document.getElementById('page-number');
const limitSelect = document.getElementById('limit-select');

let currentPage = 1;
let limit = 10;
let totalPhotos = 0;

// Fetch total number of photos from API
async function fetchTotalPhotos() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/photos');
        if (!response.ok) {
            throw new Error('Failed to fetch total photos');
        }
        const data = await response.json();
        totalPhotos = data.length;
    } catch (error) {
        console.error(error);
        errorDiv.textContent = 'Error loading photos. Please try again later.';
    }
}

// Fetch photos from API
async function fetchPhotos(page, limit) {
    loader.style.display = 'block';
    errorDiv.textContent = '';
    gallery.innerHTML = '';

    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${page}&_limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch photos');
        }
        const photos = await response.json();
        displayPhotos(photos);
        // Calculate if there are more photos
        const maxPage = Math.ceil(totalPhotos / limit);
        nextButton.disabled = page >= maxPage;
    } catch (error) {
        console.error(error);
        errorDiv.textContent = 'Error loading photos. Please try again later.';
    } finally {
        loader.style.display = 'none';
    }
}

// Display photos in the gallery
function displayPhotos(photos) {
    photos.forEach(photo => {
        const photoItem = document.createElement('div');
        photoItem.classList.add('photo-item', 'fade-in');

        const img = document.createElement('img');
        img.src = photo.thumbnailUrl;
        img.alt = photo.title;

        const title = document.createElement('p');
        title.textContent = photo.title;

        photoItem.appendChild(img);
        photoItem.appendChild(title);
        gallery.appendChild(photoItem);
    });
}

// Update page number text
function updatePageNumber() {
    pageNumber.textContent = `Page ${currentPage}`;
}

// Event listeners for pagination buttons
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchPhotos(currentPage,limit);
        updatePageNumber();
        updateButtonState();
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    fetchPhotos(currentPage,limit);
    updatePageNumber();
    updateButtonState();
});

// Disable Previous button if on page 1
function updateButtonState() {
    prevButton.disabled = currentPage === 1;
}

// Event listener for limit change
limitSelect.addEventListener('change', () => {
    limit = parseInt(limitSelect.value);
    currentPage = 1; // Reset to first page when limit changes
    handlePageChange();
    updateButtonState();
});

// Watch for page changes
function handlePageChange() {
    fetchPhotos(currentPage,limit);
    updatePageNumber();
    updateButtonState();
}

// Initialize app
async function init() {
    await fetchTotalPhotos();
    handlePageChange();
}

init();