import axios from "axios";
import minimist from 'minimist';
import mergeImg from 'merge-img';
import { baseUrl } from './constants.js';

// parse argument options
let argv = minimist(process.argv.slice(2));
let { greeting = 'Hello', who = 'You', width = 400, height = 500, color = 'Pink', size = 100 } = argv;

// generate urls for requests
const urlCreator = param => `${baseUrl+param}?width=${width}&height=${height}&color${color}&s=${size}`;

// generating requests
const requestCreator = message => axios.get(urlCreator(message), { responseType: 'arraybuffer' });

// merge images
function mergeImages (firstImg, secImg) {
  return mergeImg([Buffer.from(firstImg, 'binary'), Buffer.from(secImg, 'binary')])
    .then(img => img.write('catass.png', () => console.log('Image saved!')));
}

// fetch images and merge
async function createImage() {
    try {
        const [firstImg, secImg] = await axios.all([requestCreator(greeting), requestCreator(who)]);
        await mergeImages(firstImg.data, secImg.data);
    } catch (error) {
      console.error(error);
    }
};

createImage();