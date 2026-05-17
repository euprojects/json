const http = require('http');

const server = http.createServer((req, res) => {
  // Handle POST /json-array
  if (req.method === 'POST' && req.url === '/json-array') {
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

        // Check if numbers exists
        if (!data.numbers) {
          res.statusCode = 422;
          return res.end('Missing numbers');
        }

        // Check if numbers is an array
        if (!Array.isArray(data.numbers)) {
          res.statusCode = 422;
          return res.end('Numbers must be an array');
        }

        // Check if all values are numbers
        const hasInvalidValues = data.numbers.some(
          number => typeof number !== 'number'
        );

        if (hasInvalidValues) {
          res.statusCode = 422;
          return res.end('Array must contain only numbers');
        }

        // Calculate count
        const count = data.numbers.length;

        // Calculate sum
        const sum = data.numbers.reduce(
          (total, number) => total + number,
          0
        );

        // Calculate average
        const average = count === 0 ? 0 : sum / count;

        // Create response object
        const response = {
          count,
          sum,
          average
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