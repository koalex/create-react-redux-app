const fs       = require('fs');
const path     = require('path');
const globSync = require('glob')['sync'];
const chokidar = require('chokidar');

const DEFAULT_LOCALE           = 'ru';
const DEFAULT_MESSAGES_PATTERN = path.join(__dirname, 'messages/src/**/*.json');
const LANG_DIR                 = path.join(__dirname, 'messages');


function writeMessages () {
    const defaultMessages = globSync(DEFAULT_MESSAGES_PATTERN).map((filename) => fs.readFileSync(filename, 'utf8'))
        .map((file) => JSON.parse(file))
        .reduce((collection, descriptors) => {
            descriptors.forEach(({id, defaultMessage}) => {
                if (collection.hasOwnProperty(id)) {
                    throw new Error(`Duplicate message id: ${id}`);
                }

                collection[id] = defaultMessage;
            });

            return collection;
        }, {});
    fs.writeFileSync(LANG_DIR + '/' + DEFAULT_LOCALE + '.json', JSON.stringify(defaultMessages, null, 2)); // FIXME: сделать merge dict-ов, а не просто запись
}

const i18nWatcher = chokidar.watch(globSync(DEFAULT_MESSAGES_PATTERN));

    i18nWatcher.on('ready', () => {
        i18nWatcher.on('all', (/*ev, filePath*/) => {
            writeMessages();
        });
    });

writeMessages();
