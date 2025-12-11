//render each post 
function renderPosts(posts){
    const container = document.getElementById('post-container'); //get the container for the posts

    if (!container) {
        console.error('post-container element not found!');
        return;
    }

    container.innerHTML = "";

    posts.forEach(post => { //for each post, get the div and then add the post card to it
        const newPost = document.createElement('div');
        newPost.classList.add('post-card');

        //within that post, set it up using this format (image,title,date,etc)
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
        container.appendChild(newPost) //add it to the posts container
    })
}

// Store all posts for filtering
let allPosts = [];  //empty because we want to render from forumPostData each time
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
        } 
        else {
            activeFilters.push(tagName);
        }
        
        // Filter and render posts
        filterPosts();
    });
});

//filter posts when a filter tag is selected
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

//submit post
document.getElementById("submit-post-btn").addEventListener("click", () => {
    //get the data for the post from each feild filled out in the add post modal
    const newPost = {
        title: document.getElementById("title-input").value,
        date: document.getElementById("date-input").value,
        tags: document.getElementById("tags-input").value.split(",").map(t => t.trim()),
        photoUrl: document.getElementById("photo-input").value,
        description: document.getElementById("description-input").value
    };

    // Send the new post to the server
    fetch("/api/forum-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
    })
    .then(res => res.json())
    .then(() => {
    // Add new post to local list
    allPosts.push(newPost);
    //re render the posts so that the new post shows up
    renderPosts(allPosts);

    //reset so the modal is blank for the next new post 
    document.getElementById("title-input").value = ""; //setting the value to nothing
    document.getElementById("date-input").value = "";
    document.getElementById("tags-input").value = "";
    document.getElementById("photo-input").value = "";
    document.getElementById("description-input").value = "";

    // CLOSE THE MODAL
    closeModal();
    });

});

const openBtn = document.getElementById("open-form-btn");
const modal = document.getElementById("post-modal");
const overlay = document.getElementById("modal-overlay");
const closeBtn = document.getElementById("close-modal");

// OPEN MODAL (when open button is clicked)
openBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

// CLOSE MODAL (when close button is clicked)
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

//loads existing posts from the server
fetch("/api/forum-posts")
  .then(res => res.json())
  .then(data => {
      allPosts = data;
      renderPosts(allPosts);
});

//SHOW MORE / SHOW LESS TAGS
// Allow collapsing tag groups inside filter-boxes
document.querySelectorAll(".filter-box").forEach(box => {
  const grid = box.querySelector(".collapsible-tags");
  const btn = box.querySelector(".toggle-tags-btn");
  if (!grid || !btn) return;  // safety check

  //toggle between showing all the tags and only the top line
  btn.addEventListener("click", () => {
    grid.classList.toggle("expanded");
    btn.textContent = grid.classList.contains("expanded") 
      ? "Show Less" 
      : "Show More";
  });
});

//TAG SEARCH FILTERING
document.querySelectorAll(".filter-box").forEach(box => {
    const input = box.querySelector(".search-box"); //look for input from the tag search box 
    const tags = box.querySelectorAll(".tag-button"); //tags from inside tag grid
    if (!input) return; //if no input return (dont need to search)
 
    input.addEventListener("input", () => {
        const value = input.value.toLowerCase(); //transform text to all lowercase for better searching

        tags.forEach(tag => { //for each tag listed
            const text = tag.textContent.toLowerCase(); //get the text from the tag and lowercase it

            // Show tags containing the input text
            tag.style.display = text.includes(value) ? "inline-flex" : "none";
        });
    });
});
