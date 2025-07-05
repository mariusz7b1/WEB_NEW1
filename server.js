const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const imagesRoot = path.join(__dirname, 'IMAGES');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/IMAGES', express.static(imagesRoot));

app.get('/api/folders', (req, res) => {
    fs.readdir(imagesRoot, { withFileTypes: true }, (err, files) => {
        if (err) return res.status(500).send('Błąd odczytu folderu');
        const dirs = files.filter(f => f.isDirectory()).map(d => d.name);
        res.json(dirs);
    });
});

app.get('/api/photos/:folder', (req, res) => {
    const folderPath = path.join(imagesRoot, req.params.folder);
    fs.readdir(folderPath, (err, files) => {
        if (err) return res.status(404).send('Nie znaleziono folderu');
        const images = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
        res.json(images);
    });
});

app.listen(port, () => {
    console.log(`Serwer działa na porcie ${port}`);
});
