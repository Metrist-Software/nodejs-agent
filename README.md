# Metrist In-Process Agent for NodeJS

MetristAgent is the agent NodeJS plugin. It intercepts HTTP calls and sends data to
the local Metrist Monitoring Agent. To install simply run 

      npm install @metrist/metrist-agent

## Usage

As early in your application's lifecycle as possible, the agent should be initalized and connected:

```javascript
import { MetristAgent } from "@metrist/metrist-agent";

const agent = new MetristAgent();
// or pass a host and port:
new MetristAgent({ host: 'HOST', port: 1234 });


agent.connect();


// Disconnect once your app closes
agent.disconnect();
```

The MetristAgent constructor can take an object that contains `host` and `port`
to configure the telemetry destination, otherwise it will attempt to use the
`METRIST_MONITORING_AGENT_HOST` and `METRIST_MONITORING_AGENT_PORT` environment
variables or default to `'127.0.0.1'` and `51712`.
