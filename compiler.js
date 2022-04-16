const {compile} = require('nexe')

compile({
    input: './app.js',
    target: 'windows-x64-8.4.0',
    output: 'stockx'
}).then(() => {console.log('success')})