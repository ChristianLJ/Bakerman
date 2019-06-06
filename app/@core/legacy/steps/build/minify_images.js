const fs = require("fs");
const glob = require("glob");
const sharp = require('sharp');
const path = require("path");
const getBuildVars = require("../../utils/get-build-vars");
const Log = require("../../../Log/Log");

function minifyImage(file, mode, firstRun) {
    try {
        const image = fs.readFileSync(file);

        return new Promise((resolve, reject) => {
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

                    resolve();
                });
        });
    } catch (e) {

    }
}

function createWebP(file, mode) {
    const image = fs.readFileSync(file);
    const shouldCreateWebP = getBuildVars().config.createWebP;

    return new Promise((resolve, reject) => {
        if (shouldCreateWebP) {
            const lastIndex = file.split(".").length;
            const fileExtension = file.split(".")[lastIndex - 1];
            const newFileName = file.replace(fileExtension, "webp");

            const skipWebP = fs.existsSync(path.normalize(newFileName));
            if (skipWebP) {
                resolve("skipping webp, it exists");
            } else {
                sharp(image)
                    .webp()
                    .toBuffer(function (err, buffer) {
                        if (err) {
                            reject(err);
                        }

                        fs.writeFileSync(newFileName, buffer);

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

module.exports = function run(baseDir, mode, firstRun) {
    return {
        run() {
            Log.progress("Minifying images and creating webP.");

            return new Promise((resolve, reject) => {
                try {
                    const directory = path.join(baseDir + "/dist/**/*.jpg");

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
