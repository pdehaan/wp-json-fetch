const fs = require("node:fs/promises");
const axios = require("axios");

main();

async function main() {
  const posts = await fetchPages();
  await fs.writeFile("wp.json", JSON.stringify(posts));
  console.log("Done!", posts.length);
}

async function fetchPages(page = 1) {
  const res = [];
  let totalPages = 1;
  do {
    console.log(`Fetching page ${page}/${totalPages}`);
    const { data, headers } = await axios.get("https://wordpress.org/news/wp-json/wp/v2/posts", {params: {per_page:50, page}});
    res.push(data);
    totalPages = headers['x-wp-totalpages'];
    page += 1;
  } while (page <= totalPages);
  return res.flat();
}
