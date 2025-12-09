const forumPosts = [
    {
        "title": "Adaptive jeans for seated comfort?",
        "date": "2025-01-20",
        "tags": ["Wheelchair", "Pants", "Denim"],
        "photoUrl": "images/jeans.jpg",
        "description": "I'm searching for jeans that don't dig into the waist or bunch when seated all day. Any brands you recommend?"
    },
    {
        "title": "Looking for sensory-friendly shirts",
        "date": "2025-03-02",
        "tags": ["Sensory", "Tops", "Soft Fabric"],
        "photoUrl": "images/sensory-shirt.jpg",
        "description": "I need shirts without itchy seams or tags. Soft fabrics preferred! Any good stores or online brands?"
    },
    {
        "title": "Need winter boots with easy closures",
        "date": "2024-12-01",
        "tags": ["Shoes", "Mobility", "Winter"],
        "photoUrl": "images/winter-boots.jpg",
        "description": "Traditional laces are tough for me with hand mobility issues. Looking for zipper or velcro winter boots recommendations."
    },
    {
        "title": "Fashion tips for prosthetic users?",
        "date": "2025-02-12",
        "tags": ["Amputee", "Style", "Advice"],
        "photoUrl": "images/prosthetic-fashion.jpg",
        "description": "How do you style outfits that work well with prosthetics? I'm new to this and would love advice or outfit inspiration."
    },
    {
        "title": "Brand recommendations for chronic pain comfort",
        "date": "2025-01-08",
        "tags": ["Chronic Pain", "Comfort Wear"],
        "photoUrl": "images/comfort-wear.jpg",
        "description": "Long wear clothing that puts pressure in the wrong places can be tough. Looking for soft, flexible, pain-friendly clothing lines."
    },
    {
        "title": "Where to find magnetic closures for jackets?",
        "date": "2024-11-19",
        "tags": ["Outerwear", "Magnetic Closures", "Hands-Free"],
        "photoUrl": "images/magnetic-jacket.jpg",
        "description": "Buttons are difficult for me — I've heard of jackets with magnetic closures but don’t know where to buy them."
    },
    {
        "title": "Adaptive swimwear resources?",
        "date": "2024-08-25",
        "tags": ["Swimwear", "Adaptive Clothing"],
        "photoUrl": "images/adaptive-swimwear.jpg",
        "description": "Looking for swimsuits that are accessible to put on and comfortable for mobility limitations. Any brands you trust?"
    }
];

function renderPosts(posts){
    const container = document.getElementById('post-container');

    if (!container) {
        console.error('post-container element not found!');
        return;
    }

    container.innerHTML = "";

    posts.forEach(post => {
        const newPost = document.createElement('div');
        newPost.classList.add('post-card');

        newPost.innerHTML = `
            <img src="${post.photoUrl}" alt="${post.title}" class="post-image" />
            <div class="post-content">
                <h3 class="post-title">${post.title}</h3>
                <p class="post-date">${new Date(post.date).toLocaleDateString()}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <p class="post-description">${post.description}</p>
            </div>
        `;
        container.appendChild(newPost)
    })
}

// Store all posts for filtering
let allPosts = [...forumPosts]; // Keep original data
let activeFilters = []; // Track which tags are selected

// Get all tag buttons
const tagButtons = document.querySelectorAll('.tag-button');

// Add click event to each tag button
tagButtons.forEach(button => {
    button.addEventListener('click', function() {
        const tagName = this.textContent;
        
        // Toggle active state
        this.classList.toggle('active');
        
        // Add or remove from active filters
        if (activeFilters.includes(tagName)) {
            activeFilters = activeFilters.filter(tag => tag !== tagName);
        } else {
            activeFilters.push(tagName);
        }
        
        // Filter and render posts
        filterPosts();
    });
});

function filterPosts() {
    const container = document.getElementById('post-container');
    
    // If no filters selected, show all posts
    if (activeFilters.length === 0) {
        renderPosts(allPosts);
        return;
    }
    
    // Filter posts that have at least one matching tag
    const filteredPosts = allPosts.filter(post => {
        return post.tags.some(tag => activeFilters.includes(tag));
    });
    
    // Render filtered posts
    renderPosts(filteredPosts);
}

renderPosts(forumPosts);
