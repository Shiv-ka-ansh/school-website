// Gallery Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initGallery();
});

function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const searchInput = document.getElementById('gallery-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let allGalleryItems = [];
    let filteredItems = [];
    let currentFilter = 'all';
    let currentSearchTerm = '';
    let currentLightboxIndex = 0;
    let visibleItemsCount = 12;

    // Initialize gallery items
    function initGalleryItems() {
        allGalleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        filteredItems = [...allGalleryItems];
        updateGalleryDisplay();
        addGalleryStats();
    }

    // Add gallery statistics
    function addGalleryStats() {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'gallery-stats';
        statsContainer.innerHTML = `
            <div class="stat">
                <span class="stat-number" id="total-photos">${allGalleryItems.length}</span>
                <span class="stat-label">Total Photos</span>
            </div>
            <div class="stat">
                <span class="stat-number" id="visible-photos">${Math.min(visibleItemsCount, filteredItems.length)}</span>
                <span class="stat-label">Showing</span>
            </div>
            <div class="stat">
                <span class="stat-number" id="categories">${getUniqueCategories().length}</span>
                <span class="stat-label">Categories</span>
            </div>
        `;
        
        const container = document.querySelector('.gallery-main .container');
        container.insertBefore(statsContainer, galleryGrid);
    }

    // Get unique categories
    function getUniqueCategories() {
        const categories = allGalleryItems.map(item => item.dataset.category);
        return [...new Set(categories)];
    }

    // Update gallery display
    function updateGalleryDisplay() {
        // Hide all items first
        allGalleryItems.forEach(item => {
            item.classList.add('hidden');
            item.classList.remove('fade-in');
        });

        // Show filtered items with animation
        filteredItems.slice(0, visibleItemsCount).forEach((item, index) => {
            setTimeout(() => {
                item.classList.remove('hidden');
                item.classList.add('fade-in');
            }, index * 50);
        });

        // Update load more button
        if (filteredItems.length > visibleItemsCount) {
            loadMoreBtn.style.display = 'inline-block';
            loadMoreBtn.textContent = `Load More (${filteredItems.length - visibleItemsCount} remaining)`;
        } else {
            loadMoreBtn.style.display = 'none';
        }

        // Update stats
        updateGalleryStats();

        // Show no results message if needed
        showNoResultsMessage();
    }

    // Update gallery statistics
    function updateGalleryStats() {
        const totalPhotos = document.getElementById('total-photos');
        const visiblePhotos = document.getElementById('visible-photos');
        
        if (totalPhotos) totalPhotos.textContent = filteredItems.length;
        if (visiblePhotos) visiblePhotos.textContent = Math.min(visibleItemsCount, filteredItems.length);
    }

    // Show no results message
    function showNoResultsMessage() {
        const existingMessage = document.querySelector('.no-results');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (filteredItems.length === 0) {
            const noResultsHTML = `
                <div class="no-results">
                    <h3>No photos found</h3>
                    <p>Try adjusting your search terms or selected category.</p>
                    <button class="btn-secondary" onclick="clearAllFilters()">Clear All Filters</button>
                </div>
            `;
            galleryGrid.insertAdjacentHTML('afterend', noResultsHTML);
        }
    }

    // Filter functionality
    function filterGallery() {
        filteredItems = allGalleryItems.filter(item => {
            const category = item.dataset.category;
            const title = item.dataset.title.toLowerCase();
            const description = item.querySelector('.gallery-overlay p')?.textContent.toLowerCase() || '';

            const matchesFilter = currentFilter === 'all' || category === currentFilter;
            const matchesSearch = currentSearchTerm === '' || 
                                title.includes(currentSearchTerm) || 
                                description.includes(currentSearchTerm);

            return matchesFilter && matchesSearch;
        });

        visibleItemsCount = 12; // Reset visible count
        updateGalleryDisplay();
    }

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearchTerm = this.value.toLowerCase().trim();
            filterGallery();
        });
    }

    // Filter button functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Update current filter
            currentFilter = this.dataset.filter;
            filterGallery();
        });
    });

    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            const currentlyVisible = Math.min(visibleItemsCount, filteredItems.length);
            visibleItemsCount += 8;
            
            // Show loading state
            this.innerHTML = '<div class="loading-spinner"></div> Loading...';
            this.disabled = true;

            // Simulate loading delay
            setTimeout(() => {
                updateGalleryDisplay();
                this.innerHTML = 'Load More';
                this.disabled = false;
            }, 500);
        });
    }

    // Lightbox functionality
    function openLightbox(index) {
        const visibleItems = filteredItems.slice(0, visibleItemsCount);
        const item = visibleItems[index];
        
        if (!item) return;

        const img = item.querySelector('img');
        const overlay = item.querySelector('.gallery-overlay');
        
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxTitle.textContent = overlay.querySelector('h4').textContent;
        lightboxDescription.textContent = overlay.querySelector('p').textContent;

        currentLightboxIndex = index;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Update navigation buttons
        updateLightboxNavigation(visibleItems.length);
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxNavigation(totalItems) {
        lightboxPrev.style.display = currentLightboxIndex > 0 ? 'block' : 'none';
        lightboxNext.style.display = currentLightboxIndex < totalItems - 1 ? 'block' : 'none';
    }

    function showPreviousImage() {
        if (currentLightboxIndex > 0) {
            openLightbox(currentLightboxIndex - 1);
        }
    }

    function showNextImage() {
        const visibleItems = filteredItems.slice(0, visibleItemsCount);
        if (currentLightboxIndex < visibleItems.length - 1) {
            openLightbox(currentLightboxIndex + 1);
        }
    }

    // Gallery item click handlers
    function addGalleryClickHandlers() {
        allGalleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                // Find the index in the currently visible filtered items
                const visibleItems = filteredItems.slice(0, visibleItemsCount);
                const visibleIndex = visibleItems.indexOf(item);
                
                if (visibleIndex !== -1) {
                    openLightbox(visibleIndex);
                }
            });
        });
    }

    // Lightbox event handlers
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPreviousImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNextImage);
    }

    // Close lightbox on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPreviousImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (lightbox) {
        lightbox.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });

        lightbox.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                showNextImage();
            } else {
                // Swipe right - previous image
                showPreviousImage();
            }
        }
    }

    // Clear all filters function (global)
    window.clearAllFilters = function() {
        // Reset search
        if (searchInput) {
            searchInput.value = '';
            currentSearchTerm = '';
        }

        // Reset filter
        filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        currentFilter = 'all';

        // Refilter gallery
        filterGallery();
    };

    // Lazy loading for images (performance optimization)
    function initLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Share functionality
    function initShareButtons() {
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('share-btn')) {
                const item = e.target.closest('.gallery-item');
                const title = item.dataset.title;
                const img = item.querySelector('img');
                
                if (navigator.share) {
                    navigator.share({
                        title: `${title} - SMPS Jhansi Gallery`,
                        text: `Check out this photo from SMPS Jhansi: ${title}`,
                        url: window.location.href
                    });
                } else {
                    // Fallback - copy to clipboard
                    navigator.clipboard.writeText(window.location.href).then(() => {
                        showMessage('Link copied to clipboard!', 'success');
                    });
                }
            }
        });
    }

    // Initialize everything
    initGalleryItems();
    addGalleryClickHandlers();
    initLazyLoading();
    initShareButtons();

    // URL parameter handling for direct category links
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam) {
        const filterBtn = document.querySelector(`[data-filter="${categoryParam}"]`);
        if (filterBtn) {
            filterBtn.click();
        }
    }

    // Auto-refresh functionality (for dynamic content)
    function autoRefresh() {
        // This would be used if gallery content is loaded dynamically
        // For now, it's a placeholder for future enhancement
    }

    // Performance monitoring
    function trackGalleryPerformance() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes('gallery')) {
                    console.log('Gallery performance:', entry);
                }
            }
        });
        observer.observe({ entryTypes: ['measure'] });
    }

    // Error handling for failed image loads
    function handleImageErrors() {
        document.querySelectorAll('.gallery-item img').forEach(img => {
            img.addEventListener('error', function() {
                this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
                this.alt = 'Image not found';
                this.closest('.gallery-item').classList.add('error');
            });
        });
    }

    handleImageErrors();
}

// Utility functions for gallery
window.GalleryUtils = {
    // Download image function
    downloadImage: function(imageSrc, filename) {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = filename || 'gallery-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // Get gallery statistics
    getGalleryStats: function() {
        const allItems = document.querySelectorAll('.gallery-item');
        const categories = {};
        
        allItems.forEach(item => {
            const category = item.dataset.category;
            categories[category] = (categories[category] || 0) + 1;
        });

        return {
            total: allItems.length,
            categories: categories,
            visible: document.querySelectorAll('.gallery-item:not(.hidden)').length
        };
    },

    // Random gallery item
    showRandomImage: function() {
        const visibleItems = document.querySelectorAll('.gallery-item:not(.hidden)');
        if (visibleItems.length > 0) {
            const randomIndex = Math.floor(Math.random() * visibleItems.length);
            visibleItems[randomIndex].click();
        }
    }
};