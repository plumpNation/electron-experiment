const path = require('path')
const fs = require('fs')
const archiver = require('archiver')
const streamBuffers = require('stream-buffers')
const fetch = require('electron-fetch').default;

/**
 * Absolute path to the file or directory you wish to zip
 *
 * @todo error handling, cancelling?, zip compression config?, buffer size?
 * @param {string} src
 * @returns {Promise<Buffer>}
 */
const getZipBuffer = (src) => {
  const name = path.basename(src);
  const zipArchive = archiver('zip');

  const output = new streamBuffers.WritableStreamBuffer({
    initialSize: (1000 * 1024),   // start at 1000 kilobytes.
    incrementAmount: (1000 * 1024) // grow by 1000 kilobytes each time buffer overflows.
  });

  zipArchive.pipe(output);

  return new Promise((resolve, reject) => {
    try {
      fs.accessSync(src, fs.constants.F_OK);

    } catch (err) {
      reject('Could not access ' + src);

      return;
    }

    output.on('finish', () => {
      resolve({
        name: name + '.zip',
        contents: output.getContents(),
      });
    });

    if (fs.statSync(src).isDirectory()) {
      // add the directory and all it's subdirectories to the zip
      zipArchive.directory(src, name);

    } else {
      // add the file with it's original name to the zip
      zipArchive.append(fs.createReadStream(src), { name });
    }

    zipArchive.finalize()
      .then(() => {
        output.end(); // triggers the finish event
      });
  });
}

const FormData = require('form-data');

const imgDir = '/Users/gavin/dev/electron/img/';

const imgs = [
  imgDir, // dir
  path.join(imgDir, 'boom.jpg'), // file
  path.join(imgDir, 'boom.txt') // file
];

imgs.forEach(img => {
  getZipBuffer(img)
    .then(res => {
      console.log(res);

      return res;
    })
    .then(({name, contents}) => sendFileToServer(name, contents))
    .catch(console.error);
});

function sendFileToServer(name, file) {
  const form = new FormData();

  form.append('file', file, {
    contentType: 'application/zip',
    name: 'file',
    filename: `${name}`,
  })

  fetch('http://localhost:1234/upload', {
    method: 'POST',
    body: form,
  })
  .then(res => res.json())
  .then(console.log)
  .catch(err => console.error);
}
