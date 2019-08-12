const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 1234;

app.use(cookieParser());

app.get('/', (req, res) => {
  res.cookie('name', 'jeff');
  res.json({ message: 'Hello World!' });
});

app.get('/test-cookie', (req, res) => {
  console.log('Cookies received');
  console.log(req.cookies);
  res.json({ message: 'Hello World!' });
});

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`));
