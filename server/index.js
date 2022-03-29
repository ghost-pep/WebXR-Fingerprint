import express from 'express';

import fs from 'fs';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('static'));

// DB
const dbFile = './fingerprints.txt';

const storeDB = data => {
    fs.appendFileSync(dbFile, JSON.stringify(data) + '\n');
};

app.post('/fingerprint', (req, res) => {
    console.log("hello")
    let fp = req.body.fingerprint;
    console.log("Got fingerprint " + fp);
    storeDB(fp);
    res.send();
});

app.listen(port, () => {
    console.log(`Started at http://localhost:${port}/`);
});