import {describe, test} from '@jest/globals';
import * as https from 'https';
import { MetristAgent } from '../src';

// Change describe.skip() to describe() in order to run integration test
describe.skip('integration tests', () => {
  test('sendTelemetryFunction gets called', (done) => {
    const agent = new MetristAgent({
      sendTelemetryFunction(message) {
        console.log("message", message.toString());
        done();
      },
    });

    agent.connect();

    function callapi() {
      https.get('https://jsonplaceholder.typicode.com/users', res => {
        res.on('data', d => {
          // process.stdout.write(d);
        });
      })
      .on('error', err => {
        done(err);
      });
    }

    callapi();
  });
});
