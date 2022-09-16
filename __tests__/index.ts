import {describe, test, expect} from '@jest/globals';
import * as https from 'https';
import { MetristAgent } from '../src';

// Change describe.skip() to describe() in order to run integration test
describe.skip('integration tests', () => {
  test('sendTelemetryFunction gets called', async () => {
    const agent = new MetristAgent({
      sendTelemetryFunction(message) {
        const duration = parseInt(message.toString().split("\t")[4].trim(), 10)
        expect(duration).toBeLessThan(1000)
      },
    });

    agent.connect();
    await new Promise(resolve => setTimeout(resolve, 1000))

    await new Promise((resolve, reject) => {
      https.get('https://jsonplaceholder.typicode.com/users', res => {
        res.on('data', d => {
          resolve(d)
        });
      })
      .on('error', err => {
        reject(err)
      });
    })
  });
});
