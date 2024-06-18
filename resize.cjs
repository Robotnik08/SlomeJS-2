// resizing all images in assets/img/game/tiles to 1024x1024 and replace the original images with the resized images
const fs = require('fs');
// sharp is too new for node 10.15.3 so we use jimp instead
const Jimp = require('jimp');
const path = require('path');

const dir = path.join(__dirname, 'assets/img/game/tiles');
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.png')) {
        // resize the image with nearest neighbor algorithm
        Jimp.read(path.join(dir, file))
            .then(image => {
                return image.resize(1024, 1024, Jimp.RESIZE_NEAREST_NEIGHBOR);
            })
            .then(image => {
                return image.writeAsync(path.join(dir, file));
            })
            .then(() => {
                console.log(`Resized ${file}`);
            })
            .catch(err => {
                console.error(`Failed to resize ${file}: ${err}`);
            });
    }
    });