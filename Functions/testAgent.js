const http = require('http');

http.get('http://localhost:5174', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // We can't actually execute JS with http.get! We need a headless browser.
    console.log("We need a browser to execute the JS.");
  });
}).on('error', (err) => console.log('Error:', err.message));
