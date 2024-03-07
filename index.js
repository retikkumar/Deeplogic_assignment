const express = require("express");
const https = require("https");

const app = express();

const PORT = 3000;

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

function extractStories(html) {
  const stories = [];
  const regex =
    /<a href="([^"]+)">\s*<h3 class="featured-voices__list-item-headline display-block">([^<]+)<\/h3>\s*<\/a>/g;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const [, relativeUrl, title] = match;
    const link = "https://time.com" + relativeUrl;
    stories.push({ title, link });
  }

  return stories;
}

app.get("/", (req, res) => {
  res.send("SERVER IS RUNNING");
});

app.get("/getTimeStories", async (req, res) => {
  const timeUrl = "https://time.com/";
  const htmlContent = await fetchHTML(timeUrl);
  console.log(htmlContent);
  const stories = extractStories(htmlContent);
  res.json(stories);
});

app.listen(PORT, (req, res) => {
  console.log(`Server is running on PORT : ${PORT}`);
});
