import { createSocket, Socket } from 'dgram';
import * as http from 'http';
import { performance } from 'perf_hooks';

type RequestOptions = http.RequestOptions;
type RequestCallback = (response: http.IncomingMessage) => void;
type RequestMethodArgs =
  | [RequestOptions | string | URL, RequestCallback?]
  | [string | URL, RequestOptions, RequestCallback?];


type SendTelemetryFunction = (message: Buffer) => void

interface AgentParams {
  host?: string;
  port?: number;
  sendTelemetryFunction?: SendTelemetryFunction;
}

export class MetristAgent {
  private _host: string;
  private _port: number;
  private _sendTelemetryFunction: SendTelemetryFunction;
  private _socket: Socket;

  constructor();
  constructor(param: AgentParams);
  constructor(param?: AgentParams) {
    this._host = param?.host ?? process.env.METRIST_MONITORING_AGENT_HOST ?? '127.0.0.1';
    // @ts-ignore
    this._port = param?.port ?? (+process.env.METRIST_MONITORING_AGENT_PORT || 51712);
    this._sendTelemetryFunction = param?.sendTelemetryFunction ?? this.sendTelemetry;
  }

  connect() { 
    this._socket = createSocket('udp4');

    const httpModule = require('http');
    httpModule.request = this.patchHTTPMethod(httpModule, 'request');
    httpModule.get = this.patchHTTPMethod(httpModule, 'get');

    const httpsModule = require('https');
    httpsModule.request = this.patchHTTPMethod(httpsModule, 'request');
    httpsModule.get = this.patchHTTPMethod(httpsModule, 'get');
  }

  disconnect() {
    this._socket.close();
  }

  private patchHTTPMethod(module: any, method: string) {
    const httpMethod = module[method];
    const start = performance.now();
    const agent = this;
    return function(...args: RequestMethodArgs) {
      return httpMethod.apply(module, args).once('response', function(this: http.ClientRequest, _res: http.IncomingMessage) {
        const end = performance.now();
        const message = Buffer.from(`0\t${this.method}\t${this.host}\t${this.path}\t${Math.trunc(end - start)}\n`);
        agent._sendTelemetryFunction(message);
      });
    }
  }

  private sendTelemetry(message: Buffer): void {
    this._socket.send(message, this._port, this._host);
  }
}
