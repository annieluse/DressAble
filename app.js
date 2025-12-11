/*
 * DressAble (Accessible Fashion Website)
 * Name: Annie Luse
 * Email: Lusean@oregonstate.edu / Annieluse05@gmail.com
 */

const express = require("express");
const app = express();
const path = require("path")

const PORT = 3000;

// Log every request to the console so we can see what the browser is asking for.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// View engine (template rendering)
app.set("view engine", "ejs");

// Serve static files (CSS, images, client JS)
app.use(express.static("public"));
app.use(express.json()); // allows JSON body parsing

//data in the json files
const companies = require("./data/companies.json");
const products = require("./data/products.json");
const disabilities = require("./data/disabilities.json");
const companyPage = require("./data/companyPage.json");

//data for the forum (user-generated content that is permanently stored by the app’s back end)
const fs = require("fs");
const forumPostsPath = path.join(__dirname, "data/forumPostData.json");
let forumPosts = JSON.parse(fs.readFileSync(forumPostsPath));

// homepage route
app.get("/", (req, res) => {
    res.render("home");
});

//forum route
app.get("/forum", (req, res) => {
    res.render("forum"); //render forum page using the ejs
});

// Route to send all forum posts as JSON data
app.get("/api/forum-posts", (req, res) => {
    res.json(forumPosts);  // Send current list of posts to the browser
});

// Route to receive a new post from the client (when a user clicks Submit Post)
app.post("/api/forum-posts", (req, res) => {
    const newPost = req.body; // The new post data sent in the POST request body

    forumPosts.push(newPost); // Add the new post to our array of posts

     // Save updated posts list to the JSON file so posts stay permanent
    fs.writeFileSync(forumPostsPath, JSON.stringify(forumPosts, null, 2));

    res.status(201).json({ message: "Post saved!" });
});


//companies route
app.get("/companies", (req, res) => {
  res.render("companies", { companies });
});

app.get("/companies/:id", (req, res) => {
    const company = companyPage.find(c => c.id === req.params.id);

    if (!company) {
        return res.status(404).send("Company not found");
    }

    res.render("companyPage", { company }); // renders detailed template
});

//products route
app.get("/products", (req, res) => {
  res.render("products", { products });
});

//not used yet
app.get("/products/:id", (req, res) => {
  const product = products.find(c => c.id === req.params.id);
  res.render("product", { product });
});

//disabilities route
app.get("/disabilities", (req, res) => {
  res.render("disabilities", { disabilities });
});

//not used yet
app.get("/disabilities/:id", (req, res) => {
  const disability = disabilties.find(c => c.id === req.params.id);
  res.render("disability", { disability });
});

//If a user types a wrong URL, send them to 404.ejs
app.use((req, res) => {
  res.status(404).render("404")
})


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
