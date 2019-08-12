const express = require('express');
const app = express();
const port = 1234;

app.get('/', (req, res) => {
  res.cookie('name', 'jeff');
  res.json({ message: 'Hello World!' });
});

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`));
