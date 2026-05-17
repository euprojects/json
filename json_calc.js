const http = require('http');

const server = http.createServer((req, res) => {
  // Handle POST /json-calc
  if (req.method === 'POST' && req.url === '/json-calc') {
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

        // Check required fields
        if (
          data.a === undefined ||
          data.b === undefined ||
          data.operation === undefined
        ) {
          res.statusCode = 422;
          return res.end('Missing fields');
        }

        // Check if a and b are numbers
        if (
          typeof data.a !== 'number' ||
          typeof data.b !== 'number'
        ) {
          res.statusCode = 422;
          return res.end('a and b must be numbers');
        }

        let result;

        // Perform operation
        switch (data.operation) {
          case 'add':
            result = data.a + data.b;
            break;

          case 'subtract':
            result = data.a - data.b;
            break;

          case 'multiply':
            result = data.a * data.b;
            break;

          case 'divide':
            // Check division by zero
            if (data.b === 0) {
              res.statusCode = 400;
              return res.end('Division by zero');
            }

            result = data.a / data.b;
            break;

          default:
            // Invalid operation
            res.statusCode = 400;
            return res.end('Invalid operation');
        }

        // Send JSON response
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        res.end(JSON.stringify({ result }));

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