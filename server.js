const path = require('path');
const express = require('express');
const app = express();

// Serve static files
app.use(express.static('./dist/proyecto-final-front'));

// Send all requests to index.html
app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/proyecto-final-front/'}),
);

// default Heroku port
app.listen(process.env.PORT || 8080);

