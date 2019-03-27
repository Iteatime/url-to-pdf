import { AddressInfo } from 'net';

import * as nodeCleanup from 'node-cleanup';

import { Service } from './service'

const service = new Service();
const server = service.startServer();

function closeServer() {
    if (server) server.close();
}

server.on('listening', () => {
    if (process.env.NODE_ENV === 'development') console.log('\x1b[30m\x1b[47m', 'service listening on port:', '\x1b[0m', (<AddressInfo>server.address()).port);
});

server.on('error', (error: Error) => {
    console.log('\x1b[30m\x1b[47m', 'The service has thrown an error', '\x1b[0m');
    if (process.env.NODE_ENV === 'development') console.error(error.stack, '\n', JSON.stringify(error, undefined, 2));
    closeServer();
});

server.on('close', () => {
    if (process.env.NODE_ENV === 'development') console.log("\x1b[30m\x1b[47m", "service closed", "\x1b[0m");
});

nodeCleanup.default((exitCode: number | null, signal: string | null) => {
    closeServer();
    return undefined;
});