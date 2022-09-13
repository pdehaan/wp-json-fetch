const axios = require("axios");

main();

async function main() {
  const posts = await getPaginatedResults("https://wordpress.org/news/wp-json/wp/v2/posts?per_page=100&orderby=date&order=desc&_fields=id,title");
  console.log(`Fetched ${posts.length} posts`);
}

async function getPaginatedResults(path) {
  const rows = [];
  const iterator = fetchPage(path);
  for await (const data of iterator) {
    rows.push(...data);
  }
  return rows;
};

async function* fetchPage(path) {
  let url = path;
  while (url) {
    const { data, headers } = await axios.get(url);
    url = getNav(headers.link).next;
    yield data;
  }
}

function getNav(link = "") {
  const relNavRegExp = /<(?<href>.*?)>; rel="(?<rel>prev|next)"/g;
  return [...link.matchAll(relNavRegExp)]
    .reduce((acc, { groups }) =>
      Object.assign(acc, { [groups.rel]: groups.href }), {});
}
