const http = require('http');

const data = JSON.stringify({
    petId: 1, // Assumes a pet with ID 1 exists. If not, we might get a foreign key error, but we should still see the log.
    servicoId: 1, // Assumes a service with ID 1 exists.
    dataHora: new Date().toISOString(),
    status: 'Agendado'
});

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/agendamentos',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

// Write data to request body
req.write(data);
req.end();
