const fs = require('fs');

const data = 'Welcome home!';

fs.writeFile('text.txt', data, (err) => {
    if (err) {
        console.error(err);
    } else {
        console.log('File written');
    }
});