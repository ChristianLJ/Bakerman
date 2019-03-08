const fs = require("fs");
const minify = require('html-minifier').minify;
const Bakerman = require("../../../scripts/utils/Bakerman");
const glob = require("glob");
const l = require("../../utils/log").withContext("minify-images");
const sharp = require('sharp');
const path = require("path");

/**
 * @param {string} baseDir
 * @param {string} relativeFile
 * @returns {{run: () => Promise }}
 */

function minifyImage(file, mode) {
    const image = fs.readFileSync(file);

    return new Promise((resolve, reject) => {
        if (mode === "DEV") {
            resolve();
            return;
        }

        sharp(image)
            .jpeg({
                quality: 85,
                progressive: true,
                chromaSubsampling: '4:4:4'
            })
            .toBuffer(function (err, buffer) {
                if (err) {
                    reject(err);
                }

                fs.writeFileSync(file, buffer);

                l.info("Minified and saved image: " + file);
                resolve("Saved image: " + file);
            });
    });
}

function createWebP(file, mode) {
    const image = fs.readFileSync(file);
    const shouldCreateWebP = Bakerman.shouldCreateWebPImages();

    return new Promise((resolve, reject) => {
        if (shouldCreateWebP) {
            const lastIndex = file.split(".").length;
            const fileExtension = file.split(".")[lastIndex - 1];
            const newFileName = file.replace(fileExtension, "webp");

            const skipWebP = fs.existsSync(path.normalize(newFileName));
            if (skipWebP) {
                l.info("skipping webp, it exists: " + newFileName);
                resolve("skipping webp, it exists");
            } else {
                sharp(image)
                    .webp()
                    .toBuffer(function (err, buffer) {
                        if (err) {
                            reject(err);
                        }

                        fs.writeFileSync(newFileName, buffer);

                        l.info("Minified and saved image as webp: " + newFileName);
                        resolve("Saved image: " + newFileName);
                    });
            }
        } else {
            resolve("");
        }
    });
}

function resolveAllImages(imagePromises, resolve, reject) {
    Promise.all(imagePromises).then(function () {
        resolve();
    }, function (err) {
        reject(err);
    });
}

module.exports = function run(baseDir, mode) {
    return {
        run() {
            return new Promise((resolve, reject) => {
                try {
                    l.info("Minifying images");
                    const directory = path.join(baseDir + "/dist/**/*.jpg");

                    l.info("Directory: " + directory);

                    glob(directory, {}, function (er, files) {
                        const imagePromises = [];

                        for (let file of files) {
                            const imagePromise = minifyImage(file, mode)
                                .then(() => {
                                    createWebP(file, mode)
                                        .then(() => {

                                        });
                                });
                            imagePromises.push(imagePromise);
                        }

                        resolveAllImages(imagePromises, resolve, reject);
                    });
                } catch (e) {
                    reject(e);
                }
            });
        }
    };
};
