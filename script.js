// Get references to DOM elements
const gallery = document.getElementById('photo-gallery');
const loader = document.getElementById('loader');
const errorDiv = document.getElementById('error');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const pageNumber = document.getElementById('page-number');

let currentPage = 1;
const limit = 10;

// Fetch photos from API
async function fetchPhotos(page) {
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
        photoItem.classList.add('photo-item');

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
        fetchPhotos(currentPage);
        updatePageNumber();
        updateButtonState();
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    fetchPhotos(currentPage);
    updatePageNumber();
    updateButtonState();
});

// Disable Previous button if on page 1
function updateButtonState() {
    prevButton.disabled = currentPage === 1;
}

// Watch for page changes
function handlePageChange() {
    fetchPhotos(currentPage);
    updatePageNumber();
    updateButtonState();
}

// Initialize app
handlePageChange();