const express = require('express');
const app = express();
const path = require('path');

app.use( express.static(path.join(__dirname, 'public')) ); 

app.use('/',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});
app.listen( process.env.PORT || 3000);


/*
const StockXAPI = require("stockx-api");
const stockX = new StockXAPI();
const sizes = ["13", "15"];

stockX
  .fetchProductDetails(
    "https://stockx.com/nike-sb-dunk-low-grateful-dead-bears"
  )
  .then((product) => {
    getHighestBids(product.variants);
  })
  .catch((err) =>
    console.log(`Error scraping product details: ${err.message}`)
  );

function getHighestBids(variants) {
  variants.forEach((element) => {
    if (sizes.includes(element.size)) {
      console.log(
        `Size: ${element.size}, Highest bid: ${element.market.highestBid}`
      );
    }
  });
}
*/