import express from 'express'
var app = express();

app.get('/', (req,res) => {
	console.log(res.statusCode);
	res.send('Hello World');
});

app.listen(3000);