import {Cloudinary} from "cloudinary-core";
import {end} from "@cloudinary/url-gen/qualifiers/textAlignment";
const axios = require('axios');

(function () {
    const dropZone = document.getElementById('drop_zone');
    const gallery = document.querySelector('.gallery');
    const galleryEvent = new Event('render');

    gallery.addEventListener('render',() => {
        const my_breakpoints = function (width){  // width - the current width of the containing element
            return 50 * Math.ceil(width / 50);
        }
        var cl = Cloudinary.new({cloud_name: "yehudah"});

        //cl.config({breakpoints:my_breakpoints, responsive_use_breakpoints:"resize"})
        cl.responsive();
    });

    dropZone.addEventListener('dragover', (event) => {
        event.stopPropagation();
        event.preventDefault();

        event.dataTransfer.dropEffect = 'copy';
    });

    dropZone.addEventListener('drop',  async (event) => {
        event.stopPropagation();
        event.preventDefault();

        const files = event.dataTransfer.files;
        let responses = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            let data = await postData(file);
            const response = data.data;

            const url = response.secure_url;

            const item = document.createElement('div');
            item.className = 'thumbnail';

            const linkParts = url.split('/');
            const link = document.createElement('a');
            linkParts.splice(-2, 0, 'q_auto:good');
            link.setAttribute('target', '_blank');
            link.href = linkParts.join('/');

            item.appendChild(link);

            const imgParts = url.split('/');
            const img = new Image();

            // Responsive
            // imgParts.splice(-2, 0, 'q_auto:good,w_auto,c_scale');

            // Thumbnail Optimize
            imgParts.splice(-2, 0, 'q_auto:good,c_thumb,g_auto:0,h_150,w_150');

            img.className = 'cld-responsive gallery-item';
            img.dataset.src = imgParts.join('/');

            link.appendChild(img)
            gallery.appendChild(link);
        }

        dropZone.classList.toggle('hidden');
        gallery.classList.toggle('active');

        gallery.dispatchEvent(galleryEvent);
    });

    async function postData(file, endpoint = 'https://api.cloudinary.com/v1_1/yehudah/upload') {
        const form = new FormData();
        const xhr = new XMLHttpRequest();
        const size = await getImageSize(file);

        if ( ! size || size[0] > 750 || size[1] > 750 ) {
            //return Promise.reject(`The image has the wrong size: ${size[0]}x${size[1]}`);
        }

        form.append('file', file);
        form.append('tags', 'cl-yehuda');
        form.append('upload_preset', 'bwdigg9g');

        return axios.post( endpoint, form).then(function (response) {
            return response;
        }).catch(function (error) {
            console.log(error);
        });

        const json = `{"asset_id":"076171c6d048d087f9355267f4e32377","public_id":"nffbfnzpedudtz3nxtny","version":1635678102,"version_id":"3274067650061432596105cea1843e30","signature":"fbb44164044d1575b4efe1138547d9023f14af76","width":3000,"height":4000,"format":"jpg","resource_type":"image","created_at":"2021-10-31T11:01:42Z","tags":["cl-yehuda"],"bytes":3863111,"type":"upload","etag":"24126bb471de50ea06c172677cc0b64b","placeholder":false,"url":"http://res.cloudinary.com/yehudah/image/upload/v1635678102/nffbfnzpedudtz3nxtny.jpg","secure_url":"https://res.cloudinary.com/yehudah/image/upload/v1635678102/nffbfnzpedudtz3nxtny.jpg","original_filename":"1634734749170"}`;

    }

    const getImageSize = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const img = new Image;

            img.onload = function() {
                resolve( [img.width, img.height] );
            };

            img.src = reader.result;
        }
        reader.onerror = error => reject(error);
    });

})();
