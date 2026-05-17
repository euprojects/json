const http = require('http');

const server = http.createServer((req, res) => {
  // Handle POST /json-echo
  if (req.method === 'POST' && req.url === '/json-echo') {
    let body = '';

    // Collect request body data
    req.on('data', chunk => {
      body += chunk;
    });

    // When all data is received
    req.on('end', () => {
      // Missing body
      if (!body) {
        res.statusCode = 400;
        return res.end('Missing body');
      }

      try {
        // Parse JSON
        const jsonData = JSON.parse(body);

        // Success response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        // Send same JSON back
        res.end(JSON.stringify(jsonData));
      } catch (error) {
        // Invalid JSON
        res.statusCode = 400;
        res.end('Invalid JSON');
      }
    });
  } else {
    // Unknown route
    res.statusCode = 404;
    res.end('Not Found');
  }
});

// Listen on port from command line
server.listen(process.argv[2]);