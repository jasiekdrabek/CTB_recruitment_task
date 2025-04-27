// Get references to DOM elements
const gallery = document.getElementById('photo-gallery');
const loader = document.getElementById('loader');
const errorDiv = document.getElementById('error');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const pageNumber = document.getElementById('page-number');
const limitSelect = document.getElementById('limit-select');

// set default values
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
        // add style
        photoItem.classList.add('photo-item', 'fade-in');

        //add photo to DOM
        const img = document.createElement('img');
        img.src = photo.thumbnailUrl;
        img.alt = photo.title;
        img.onerror = function() {
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAWlBMVEXv8fNod4f19vhkdIRcbX52g5KPmqX29/iYoq3l6OuCj5vd4eTr7fBfcIFaa33M0dbBx82SnKe7wchtfIt8iZejq7TU2N2Ik6CwuL/Gy9Gqsrqbpa/P1NmhqrNz0egRAAADBklEQVR4nO3c63KqMBRAYUiwwUvEete27/+ax1tVAqhwEtnprO+XM62Oyw2CGTFJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJe6Mb5vqL7jjsws/wgln/dddzBZZjocuxj2HaiWNg1JL/oO3GVBA9PUzvvdF80q7AgPQ/zot1DlOnThyFBIIYWvFtrMK3mFdj30aWzFFWZjr+/qE4mFXh+YwrehsDMK34bCzmIoVEad1nC6PbD8QpXMNwOdDvKi2xMUX2jm2h7/onU2WHcZo/RCld8WN3TWZR1CeKH6LK1tTGftE2UXqpmzPGXbLwnKLkzcT8X6s/UQRReqWWX9LWs9RNGF5qOysmFb74miC9XCDUzt6k8VJtXC9jsihW9Tu5Uuq/vhvlKokuGjc1bRhWZVLdw5MWq8mU6zfNL4wKILk/W0spW6dyvOZ61p4wKd7EIzcoZot+UQVVxeA62bEmUXJuPyIV8PnDsVtxXtpikKL1S7++1U6/IZzV1g8xSFFx4i9HWMdjksNZQCGxOlFyZq8jW1VmubpZV90PngUZ8ovvDYuNt//Wy/1ZPAhsQICo+rUMa4T70msP7tJorCun8vKofKhilGWlg7wfopxlnYMMHaKUZZ2DjBuinGWPgwsDLFCAufBLqJ8RU+DXQ21OgKXwgsTzG2wpcCj1O8nsJGVvjgMNE0xbgKX5zgeYqXxKgKX57geYrnDTWmwhYTvJtiRIUtA3/fbuIpbB14mWI0hR0Cz1OMpbBT4CkxiaOwY+BpQ42isNVhwk283hJc2HmC5Va5hf8xwTgK/UxQcKGvQLGF3gKlFvoLFFroMVBmoc9AkYWeDhNyC1Xh9aJLeYV+Jyiw0Os+KLHQe6C0Qv+BwgoDBMoqDBEoqtCECJRUOPz2e5gQV2jnYa7qllOYBvr5CEGFgVBIIYXPmJ/ghZueZ+hexOWd+w3q9ycuwg5R2377DsapDflbX7rTFah+TbajQSij/aT/wNNF26FUvoELAAAAAAAAAAAAAAAAAAAAAAAAAAAA4G/4B9L3P1vg3y4/AAAAAElFTkSuQmCC';
        };
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