// Load projects data from JSON
let projectsData = {};

// Fetch the projects data
fetch('projects-data.json')
    .then(response => response.json())
    .then(data => {
        projectsData = data;
        
        // If we're on a project detail page, populate it
        const currentPage = window.location.pathname.split('/').pop();
        if (projectsData[currentPage]) {
            populateProjectPage(currentPage);
        }
        
        // If we're on index or projects page, populate the project cards
        if (currentPage === 'index.html' || currentPage === '' || currentPage === 'projects.html') {
            populateProjectCards();
        }
    })
    .catch(error => console.error('Error loading projects data:', error));

// Populate individual project detail page
function populateProjectPage(filename) {
    const project = projectsData[filename];
    
    // Update title
    document.title = `${project.title} - Ashley Kellar`;
    
    // Update project header
    const categoryEl = document.querySelector('.project-category');
    if (categoryEl) categoryEl.textContent = project.category;
    
    const titleEl = document.querySelector('.project-title');
    if (titleEl) titleEl.textContent = project.title;
    
    const subtitleEl = document.querySelector('.project-subtitle');
    if (subtitleEl) subtitleEl.textContent = project.subtitle;
    
    // Update hero image
    const heroImg = document.querySelector('.project-hero-image img');
    if (heroImg) {
        heroImg.src = project.heroImage;
        heroImg.alt = `${project.title} showcase`;
    }
    
    // Update meta information
    const metaItems = document.querySelectorAll('.meta-item p');
    if (metaItems.length >= 3) {
        metaItems[0].textContent = project.timeline;
        metaItems[1].textContent = project.tools;
        metaItems[2].textContent = project.role;
    }
    
    // Create project carousel at the bottom
    createProjectCarousel(filename);
}

// Create carousel for navigating between projects
function createProjectCarousel(currentFilename) {
    const projectDetail = document.querySelector('.project-detail');
    if (!projectDetail) return;
    
    // Get all projects except the current one
    const otherProjects = Object.keys(projectsData).filter(filename => filename !== currentFilename);
    
    if (otherProjects.length === 0) return;
    
    // Create carousel container
    const carouselSection = document.createElement('section');
    carouselSection.className = 'project-carousel-section';
    carouselSection.innerHTML = '<h2 class="carousel-title">Other Projects</h2>';
    
    // Create carousel wrapper with navigation
    const carouselWrapper = document.createElement('div');
    carouselWrapper.className = 'carousel-wrapper';
    
    // Create left arrow
    const leftArrow = document.createElement('button');
    leftArrow.className = 'carousel-arrow carousel-arrow-left';
    leftArrow.innerHTML = '&#8249;';
    leftArrow.setAttribute('aria-label', 'Previous projects');
    
    // Create carousel container
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'carousel-container';
    
    const carousel = document.createElement('div');
    carousel.className = 'project-carousel';
    
    // Add all projects except the current one
    otherProjects.forEach(filename => {
        const project = projectsData[filename];
        
        const carouselItem = document.createElement('a');
        carouselItem.href = filename;
        carouselItem.className = 'carousel-item';
        
        const img = document.createElement('img');
        img.src = project.heroImage;
        img.alt = project.title;
        
        const title = document.createElement('h4');
        title.textContent = project.title;
        
        carouselItem.appendChild(img);
        carouselItem.appendChild(title);
        carousel.appendChild(carouselItem);
    });
    
    carouselContainer.appendChild(carousel);
    
    // Create right arrow
    const rightArrow = document.createElement('button');
    rightArrow.className = 'carousel-arrow carousel-arrow-right';
    rightArrow.innerHTML = '&#8250;';
    rightArrow.setAttribute('aria-label', 'Next projects');
    
    // Assemble carousel
    carouselWrapper.appendChild(leftArrow);
    carouselWrapper.appendChild(carouselContainer);
    carouselWrapper.appendChild(rightArrow);
    carouselSection.appendChild(carouselWrapper);
    projectDetail.appendChild(carouselSection);
    
    // Initialize carousel navigation after a brief delay to ensure DOM is ready
    setTimeout(() => {
        initializeCarouselNavigation(carousel, leftArrow, rightArrow, otherProjects.length);
    }, 100);
}

// Initialize carousel navigation
function initializeCarouselNavigation(carousel, leftArrow, rightArrow, totalItems) {
    let currentIndex = 0;
    
    function getItemsPerView() {
        // Use matchMedia for consistent breakpoint checking
        return window.matchMedia('(max-width: 768px)').matches ? 1 : 3;
    }
    
    function updateCarousel() {
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, totalItems - itemsPerView);
        
        // Get the actual width of one item including gap
        const items = carousel.querySelectorAll('.carousel-item');
        if (items.length > 0) {
            const containerWidth = carousel.parentElement.offsetWidth;
            const gap = 30; // Match the gap in CSS
            
            let itemWidth;
            if (itemsPerView === 1) {
                // Mobile: full width
                itemWidth = containerWidth;
            } else {
                // Desktop: calculate width with gaps
                itemWidth = (containerWidth - (gap * (itemsPerView - 1))) / itemsPerView;
            }
            
            const offset = currentIndex * (itemWidth + gap);
            carousel.style.transform = `translateX(-${offset}px)`;
        }
        
        // Update arrow states
        leftArrow.disabled = currentIndex === 0;
        rightArrow.disabled = currentIndex >= maxIndex;
        
        leftArrow.style.opacity = currentIndex === 0 ? '0.3' : '1';
        rightArrow.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
    }
    
    leftArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });
    
    rightArrow.addEventListener('click', () => {
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, totalItems - itemsPerView);
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });
    
    // Update on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const itemsPerView = getItemsPerView();
            const maxIndex = Math.max(0, totalItems - itemsPerView);
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            updateCarousel();
        }, 100);
    });
    
    // Initial state
    updateCarousel();
}

// Populate project cards on index and projects pages
function populateProjectCards() {
    // Update preview cards on index.html
    const previewItems = document.querySelectorAll('.preview-item, .preview-right');
    previewItems.forEach(item => {
        const href = item.getAttribute('href');
        if (projectsData[href]) {
            const project = projectsData[href];
            const img = item.querySelector('img');
            const title = item.querySelector('h4');
            const blurb = item.querySelector('p');
            
            if (img) img.src = project.thumbnailImage;
            if (title) title.textContent = project.title;
            if (blurb) blurb.textContent = project.shortBlurb;
        }
    });
    
    // Generate project grid cards dynamically on projects.html
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
        // Clear existing content
        projectsGrid.innerHTML = '';
        
        // Create a card for each project in the JSON
        Object.keys(projectsData).forEach(filename => {
            const project = projectsData[filename];
            
            // Create the card element
            const card = document.createElement('a');
            card.href = filename;
            card.className = 'project-grid-card';
            card.setAttribute('data-categories', project.categories.join(' '));
            
            // Create and append the image
            const img = document.createElement('img');
            img.src = project.thumbnailImage;
            img.alt = project.title;
            card.appendChild(img);
            
            // Create and append the title
            const title = document.createElement('h3');
            title.textContent = project.title;
            card.appendChild(title);
            
            // Create and append the blurb
            const blurb = document.createElement('p');
            blurb.textContent = project.shortBlurb;
            card.appendChild(blurb);
            
            // Add the card to the grid
            projectsGrid.appendChild(card);
        });
        
        // Initialize filter functionality after cards are created
        initializeProjectFilters();
    }
}

// Initialize project filter functionality
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-grid-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'flex';
                } else {
                    const categories = card.getAttribute('data-categories');
                    if (categories && categories.includes(filter)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}
