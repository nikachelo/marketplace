const fs = require("fs");
const http = require("http");
const url = require("url");
// Files
/////////////////////////////////////////////////////////////
// Synchnorous, blocking way
// const data = fs.readFileSync("./txt/input.txt", "utf-8");
// const textOut = `${data}`;
// console.log(textOut);

// // Async, non-blocking way

// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   console.log(data);
// });

// Server
/////////////////////////////////////////////////////////////
const replaceTemplate = function (current, product) {
  let output = current.replace(/{%NAME}/g, product.productName);
  output = output.replace(/{%IMAGE}/g, product.image);
  output = output.replace(/{%FROM}/g, product.from);
  output = output.replace(/{%NUTRIENTS}/g, product.nutrients);
  output = output.replace(/{%QUANTITY}/g, product.quantity);
  output = output.replace(/{%PRICE}/g, product.price);
  output = output.replace(/{%DESCRIPTION}/g, product.description);
  output = output.replace(/{%ID}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC}/g, "not-organic");
  }
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  const pathName = req.url;
  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      content: "text/html",
    });

    const cardsHTML = dataObj
      .map((el) => {
        return replaceTemplate(tempCard, el);
      })
      .join("");

    const output = tempOverview.replace(`{%CARD}`, cardsHTML);
    res.end(output);

    // Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // Broken Links
  } else {
    res.writeHead(404);
    res.end("Incorrect page");
  }
});

server.listen(8000, "127.0.0.15", () => {
  console.log("Server has been started");
});
