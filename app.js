/* Server implementation */
const express = require('express');
const res = require('express/lib/response');
const app = express();

/* Utilities */
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

/* StockX API */
const StockXAPI = require("stockx-api");
const stockX = new StockXAPI({
  	currency: "EUR",
	//userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36"
});

/* All files in public folder are served */
app.use( express.static(path.join(__dirname, 'public')) );

/* To parse data in POST requests */
app.use(bodyParser.urlencoded({
	extended: true
})); 

/* To permit long strings passage */
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb'}));

/* Server listener */
app.listen( process.env.PORT || 3000);

/* Middlewares */
app.post("/export", (req,res) => {
	const filename = __dirname + "/public/saved/" + String(req.body.target);
	//req.body.data is written in req.body.target
	fs.writeFileSync(filename, String(req.body.data), err => {
		if(err){	console.log(err); 	return;}
	})
	res.status(200);
})

app.get("/download/:filename", (req,res) => {
	const filename = __dirname + "/public/saved/" + req.params.filename;
	res.download(filename);
})

app.get( "/fetch", (req,res)=>{
	//Response is returned if the promise is fullfilled
	try{
		fetch_stockx_product_details(req.query.targetsize, req.query.targeturl, res)
	}
	catch{
		console.log(`Error: ${err.message}`)	
		return res.status(500).send(`Error`);
	}
});

app.use('*',(req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

/* StockX API interface */
async function fetch_stockx_product_details(targetsize, targeturl, res){
	stockX.fetchProductDetails(targeturl)
	.then((product) => {
		let match_flag = 0;	//flag to check if the product is found
		//if size is matched, specific properties are taken
		product.variants.forEach((element) => {
			if (element.size == targetsize){
				match_flag = 1;
				return res.status(200).send( String(element.market.lastSale + " " + element.market.highestBid) );
			}
		});
		//not a technical error, but size is missing
		if (match_flag == 1) return; //no need to send error
		
		console.log(`Error: No size ${targetsize} found`);
		return res.status(400).send(`Error`);
		//to see:
		/*
			Why is error returned when flag is removed?
			return statement inside forEach() should be completely handle the case when a size is found.

			E.g without the "match_flag" mechanism, an error occurs in this istance:
			size: 10
			url: https://stockx.com/adidas-yeezy-boost-350-v2-bone
		*/
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