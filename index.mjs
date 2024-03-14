import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public')});
});

// js folder
app.use('/js', express.static(path.join(__dirname, 'assets/js')));

// css folder
app.use('/css', express.static(path.join(__dirname, 'assets/css')));

// img folder
app.use('/img', express.static(path.join(__dirname, 'assets/img')));

// font folder
app.use('/font', express.static(path.join(__dirname, 'assets/font')));

// json folder
app.use('/json', express.static(path.join(__dirname, 'assets/json')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
