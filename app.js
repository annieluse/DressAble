/*
 * DressAble (Accessible Fashion Website)
 * Name: Annie Luse
 * Email: Lusean@oregonstate.edu / Annieluse05@gmail.com
 */

const express = require("express");
const app = express();
const path = require("path")

const PORT = 3000;

//const postData = require('./forumPostData.json')

// Log every request to the console so we can see what the browser is asking for.
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

// View engine (template rendering)
app.set("view engine", "ejs");

// Serve static files (CSS, images, client JS)
app.use(express.static("public"));

// Temporary homepage route
app.get("/", (req, res) => {
    res.render("home");
});

// Temporary homepage route
app.get("/forum", (req, res) => {
    res.render("forum");
});

const companies = require("./data/companies.json");
const products = require("./data/products.json");
const disabilities = require("./data/disabilities.json");
const companyPage = require("./data/companyPage.json");


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


app.get("/products", (req, res) => {
  res.render("products", { products });
});

app.get("/products/:id", (req, res) => {
  const product = products.find(c => c.id === req.params.id);
  res.render("product", { product });
});

app.get("/disabilities", (req, res) => {
  res.render("disabilities", { disabilities });
});

app.get("/disabilities/:id", (req, res) => {
  const disability = disabilties.find(c => c.id === req.params.id);
  res.render("disability", { disability });
});



//If a user types a wrong URL, send them to 404.ejs
app.use((req, res) => {
  res.status(404).render("404")
})


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
