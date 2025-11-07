const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

let proxy = null;

app.use(express.json());
app.use(express.static('public')); // Serve HTML, CSS, JS files

app.get('/fetch', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('URL is required');

  try {
    const response = await axios.get(url, {
      proxy: proxy ? { host: proxy.host, port: proxy.port } : false,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124' },
      withCredentials: false // Disable cookies
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send(`Error loading page: ${error.message}`);
  }
});

app.post('/set-proxy', (req, res) => {
  const { proxyUrl } = req.body;
  if (!proxyUrl) return res.status(400).send('Proxy URL is required');

  const [host, port] = proxyUrl.split(':');
  proxy = { host, port: parseInt(port) };
  res.send('Proxy set successfully');
});

app.post('/clear-session', (req, res) => {
  // No session storage in this setup, but can be extended
  res.send('Session cleared');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
