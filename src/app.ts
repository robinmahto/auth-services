import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'welcome to auth service' });
});

export default app;
