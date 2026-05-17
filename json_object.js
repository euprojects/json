const http = require('http');

const server = http.createServer((req, res) => {
  // Handle POST /json-object
  if (req.method === 'POST' && req.url === '/json-object') {
    let body = '';

    // Collect request body
    req.on('data', chunk => {
      body += chunk;
    });

    // Process request after receiving all data
    req.on('end', () => {
      try {
        // Parse JSON body
        const data = JSON.parse(body);

        // Validate name
        if (!data.name) {
          res.statusCode = 422;
          return res.end('Missing name');
        }

        // Validate age
        if (data.age === undefined) {
          res.statusCode = 422;
          return res.end('Missing age');
        }

        // Check if age is a number
        if (typeof data.age !== 'number') {
          res.statusCode = 422;
          return res.end('Age must be a number');
        }

        // Create response object
        const response = {
          greeting: `Hello ${data.name}`,
          isAdult: data.age >= 18
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