/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const path = require('path');

const params = process.argv.slice(2);
const fileName = params[0];
const destination = params[1];

try {
  if (!fileName || !destination) {
    throw new Error('Required 2 params');
  }

  fs.stat(fileName, function (err, stats) {
    if (err) {
      return console.error(err);
    }

    if (stats.isDirectory()) {
      console.error('Source file should be a regular file, not a directory');

      return;
    }

    const destStat = fs.existsSync(destination)
      ? fs.statSync(destination)
      : null;

    if (!destStat) {
      console.error('Destination directory does not exist');

      return;
    }

    const destIsDir = destStat.isDirectory();

    const destFilePath = destIsDir
      ? path.join(destination, path.basename(fileName))
      : destination;

    if (fileName === destFilePath) {
      // should do nothing if source and destination are the same

      return;
    }

    if (!destIsDir && !fs.existsSync(destination)) {
      // Destination is a new filename
      fs.rename(fileName, destination);

      return;
    }

    if (!destIsDir && !path.extname(destination)) {
      // Destination is a file without extension
      fs.rename(fileName, destination);

      return;
    }

    fs.rename(fileName, destFilePath, function (err4) {
      if (err4) {
        console.error(err4);

        return;
      }

      console.log('File moved successfully');

      if (!destIsDir) {
        // Remove the source file if destination is not a directory
        fs.unlink(fileName, function (error) {
          if (error) {
            console.error(error);

            return;
          }
          console.log('Source file deleted successfully');
        });
      }
    });
  });
} catch (err) {
  console.error(err);
}
