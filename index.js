const express = require('express');
const app = express();
const path = require("path");
Port = 8000;

app.use('/assets', express.static(path.join(__dirname, 'assets')));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.listen(Port, () => console.log("Successfully Server Started And Listening To Server Port :",Port));
