import * as showdown from 'showdown';
import * as fs from 'fs';
import { logErr, logInfo } from '../utils/log';

const SOURCE_MD_FOLDER = './descriptions/';
const DEST_HTML_FOLDER = './public/descriptions/';
const CONVERTER = new showdown.Converter();

const mkToHtml = () => {
  logInfo('Run translate markdown to html');
  fs.readdir(SOURCE_MD_FOLDER, (err, files) => {
    if (err) {
      logErr('Error: ' + err, true);
    }
    files.forEach(file => {
      logInfo('Treatment of ' + file);
      const html = CONVERTER.makeHtml(fs.readFileSync(SOURCE_MD_FOLDER + file, 'utf8'));
      createFile(DEST_HTML_FOLDER + file.replace('.md', '.html'), html);
    });
  });
};

const createFile = (fileOut: string, data: string) => {
  fs.writeFile(fileOut, data, function(err) {
    if (err) {
      logErr('Error: ' + err, true);
    }
    logInfo('File ' + fileOut + ' created!');
  });
};

mkToHtml();