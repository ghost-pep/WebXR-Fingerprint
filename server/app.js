import express from 'express';

import fs from 'fs';
import util from 'util'

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('static'));

// DB
const dbFile = './fingerprints.txt';

const storeDB = data => {
    fs.appendFileSync(dbFile, JSON.stringify(data) + '\n');
};


app.post('/log/fingerprint', (req, res) => {
    let fp = req.body.fingerprint;
    console.log("Got fingerprint " + fp);
    console.log(util.inspect(fp))
    storeDB(fp);
    res.send();
});

app.listen(port, () => {
    console.log(`Started at http://localhost:${port}/`);
});