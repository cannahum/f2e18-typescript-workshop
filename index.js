const express = require('express');

const app = express();

app.use('/', express.static('dist'));
app.use('/dist', express.static('dist'));

app.listen(9001, () => console.log('Listening on 9001'));