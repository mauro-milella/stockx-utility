/* Server implementation */
const express = require('express');
const res = require('express/lib/response');
const app = express();

/* Utilities */
const path = require('path');

/* StockX API */
const StockXAPI = require("stockx-api");
const stockX = new StockXAPI({
  	currency: "EUR",
	userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36"
});

/* All files in public folder are served */
app.use( express.static(path.join(__dirname, 'public')) ); 

/* Server listener */
app.listen( process.env.PORT || 3000);

/* Middlewares */
app.get( "/fetch", (req,res)=>{
	//Response is returned if the promise is fullfilled
	fetch_stockx_product_details(req.query.targetsize, req.query.targeturl, res)
});

app.use('*',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

/* StockX API interface */
async function fetch_stockx_product_details(targetsize, targeturl, res){
	stockX.fetchProductDetails(targeturl)
	.then((product) => {	
		//Highest bid is taken
		product.variants.forEach((element) => {
			if (targetsize.includes(element.size)){
				return res.status(200).send( String(element.market.lastSale + " " + element.market.highestBid) );
			}
		});	
	})
	.catch((err) =>	{
		console.log(`Error scraping product details: ${err.message}`)	
		return res.status(500).send(`Error`);
	});
}

/*
const StockXAPI = require("stockx-api");
const stockX = new StockXAPI();
const sizes = ["13", "15"];

stockX
  .fetchProductDetails(
    "https://stockx.com/adidas-yeezy-boost-350-v2-bone"
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