import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('static'));

app.post('/fingerprint', (req, res) => {
    // TODO: db.store(req.body["fingerprint"]);
    res.send();
});

app.listen(port, () => {
    console.log(`Started at http://localhost:${port}/`);
});