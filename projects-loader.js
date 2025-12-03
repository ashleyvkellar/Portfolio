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
    
    // Create carousel container
    const carouselSection = document.createElement('section');
    carouselSection.className = 'project-carousel-section';
    carouselSection.innerHTML = '<h2 class="carousel-title">Other Projects</h2>';
    
    const carousel = document.createElement('div');
    carousel.className = 'project-carousel';
    
    // Add all projects except the current one
    Object.keys(projectsData).forEach(filename => {
        if (filename !== currentFilename) {
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
        }
    });
    
    carouselSection.appendChild(carousel);
    projectDetail.appendChild(carouselSection);
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
