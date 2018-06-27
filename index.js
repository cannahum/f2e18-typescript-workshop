const express = require('express');

const app = express();

app.use('/', express.static('dist'));
app.use('/dist', express.static('dist'));
app.get('/featureflags', (req, res) => {
  res.status(200).send({
    data: [
      {
        name: 'paymentsEnabled',
        currentValue: 'true',
      },
      {
        name: 'payrollEnabled',
        currentValue: 'false',
      }
    ]
  })
});

app.listen(9001, () => console.log('Listening on 9001'));