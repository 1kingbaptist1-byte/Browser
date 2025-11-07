const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

let proxy = null;

app.use(express.json());
app.use(express.static('public')); // Serve static files from public directory

// Fetch webpage through proxy
app.get('/fetch', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const response = await axios.get(url, {
      proxy: proxy ? { host: proxy.host, port: proxy.port } : false,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124' },
      withCredentials: false // Disable cookies
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: `Error loading page: ${error.message}` });
  }
});

// Set proxy
app.post('/set-proxy', (req, res) => {
  const { proxyUrl } = req.body;
  if (!proxyUrl) return res.status(400).json({ error: 'Proxy URL is required' });

  const [host, port] = proxyUrl.split(':');
  if (!host || !port) return res.status(400).json({ error: 'Invalid proxy format. Use host:port' });

  proxy = { host, port: parseInt(port) };
  res.json({ message: 'Proxy set successfully' });
});

// Clear session (placeholder for future session management)
app.post('/clear-session', (req, res) => {
  res.json({ message: 'Session cleared' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
