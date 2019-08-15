const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const streamBuffers = require('stream-buffers')
const fetch = require('electron-fetch').default;

const FormData = require('form-data');

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

        var output = new streamBuffers.WritableStreamBuffer({
          initialSize: (1000 * 1024),   // start at 1000 kilobytes.
          incrementAmount: (1000 * 1024) // grow by 1000 kilobytes each time buffer overflows.
        });

        var zipArchive = archiver('zip');

        const fileName = path.basename(srcPath);

        output.on('close', () => {
          console.log('done!')
        });

        output.on('finish', () => {
          const contents = output.getContents()

          console.log(contents)

          const form = new FormData();
          form.append('file', contents, {
            contentType: 'application/zip',
            name: 'file',
            filename: `${fileName}.zip`,
          })

          fetch('http://localhost:1234/upload', {
            method: 'POST',
            body: form,
          })
          .then(res => res.json())
          .then(console.log)
          .catch(err => console.error);
        });

        zipArchive.pipe(output);

        if (fs.statSync(srcPath).isDirectory()) {
          zipArchive.directory(srcPath, false);

        } else {
          zipArchive.append(
            fs.createReadStream(srcPath),
            { name: fileName }
          );
        }

        zipArchive.finalize()
          .then(() => {
            output.end();
          });
    });
  });
}
