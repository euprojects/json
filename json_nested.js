const http = require('http');

const server = http.createServer((req, res) => {
  // Handle POST /json-nested
  if (req.method === 'POST' && req.url === '/json-nested') {
    let body = '';

    // Collect request body
    req.on('data', chunk => {
      body += chunk;
    });

    // Process request after receiving all data
    req.on('end', () => {
      try {
        // Parse JSON
        const data = JSON.parse(body);

        // Check if user exists
        if (!data.user) {
          res.statusCode = 422;
          return res.end('Missing user');
        }

        // Check if roles exists
        if (data.user.roles === undefined) {
          res.statusCode = 422;
          return res.end('Missing roles');
        }

        // Check if roles is an array
        if (!Array.isArray(data.user.roles)) {
          res.statusCode = 422;
          return res.end('Roles must be an array');
        }

        // Create response object
        const response = {
          name: data.user.name,
          roleCount: data.user.roles.length,
          isAdmin: data.user.roles.includes('admin')
        };

        // Send JSON response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify(response));

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