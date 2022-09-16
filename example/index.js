import { MetristAgent } from '@metrist/metrist-agent';
import https from 'https';

const agent = new MetristAgent();
agent.connect();

function runGet() {
  const req = https.get('https://jsonplaceholder.typicode.com/users', res => {
    res.on('data', d => {
      // process.stdout.write(d);
    });

  }).on('error', err => {
    console.log(err);
  });

  req.end();
}


function runRquest() {
  const options = {
    hostname: 'www.google.com',
    port: 443,
    path: '/',
    method: 'GET'
  };

  const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
      // process.stdout.write(d);
    });
  });

  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}

runGet();
runRquest();


setTimeout(() => agent.disconnect(), 1000);
