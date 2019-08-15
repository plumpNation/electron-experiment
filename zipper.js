const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const streamBuffers = require('stream-buffers')

const imgDir = path.join(__dirname, 'img')

const imgs = [
  imgDir, // dir
  path.join(imgDir, 'boom.jpg'), // file
  path.join(imgDir, 'boom.txt') // file
];

try {
  fs.accessSync(imgs[0], fs.constants.F_OK);
} catch (err) {
  console.log('no access to imgDir: ' + imgs[0]);
  process.exit(2);
}

imgs.forEach(img => {
  zip(img, path.join(__dirname, path.basename(img)));
});

// folder double check
function zip(srcPath, outputPath) {
  fs.access(srcPath, fs.constants.F_OK, (notExistingError) => {
    if (notExistingError) {
        return console.error(notExistingError);
    }

    fs.access(path.dirname(outputPath), fs.constants.F_OK, (notExistingError) => {
        if (notExistingError) {
            return console.error(notExistingError);
        }

        var output = fs.createWriteStream(outputPath + '.zip');
        var zipArchive = archiver('zip');

        output.on('close', function() {
            console.log('done!')
        });

        zipArchive.pipe(output);

        if (fs.statSync(srcPath).isDirectory()) {
          zipArchive.directory(srcPath, false);

        } else {
          zipArchive.append(
            fs.createReadStream(srcPath),
            { name: path.basename(srcPath) }
          );
        }

        zipArchive.finalize();
    });
  });
}
