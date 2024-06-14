import { readdir, readFileSync, writeFile } from 'fs';
import { logErr, logInfo } from 'src/utils';
import showdown from 'showdown';

const SOURCE_MD_FOLDER = './descriptions/';
const DEST_HTML_FOLDER = './public/descriptions/';
const CONVERTER = new showdown.Converter();

const mkToHtml = () => {
  logInfo('Run translate markdown to html');
  readdir(SOURCE_MD_FOLDER, (err, files) => {
    if (err) {
      logErr('Error: ' + err.toString(), true);
    }
    files.forEach((file: string) => {
      logInfo('Treatment of ' + file);
      const html = CONVERTER.makeHtml(readFileSync(SOURCE_MD_FOLDER + file, 'utf8'));
      createFile(DEST_HTML_FOLDER + file.replace('.md', '.html'), html);
    });
  });
};

const createFile = (fileOut: string, data: string) => {
  writeFile(fileOut, data, function(err) {
    if (err) {
      logErr('Error: ' + err, true);
    }
    logInfo('File ' + fileOut + ' created!');
  });
};

mkToHtml();