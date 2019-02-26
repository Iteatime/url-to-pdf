import { Service } from './service'
import * as nodeCleanup from 'node-cleanup';

const service = new Service();
const server = service.startServer();

function closeServer() {
  console.log("\x1b[35m\x1b[47m", "serveur closed", "\x1b[0m");
  server.close();
}

nodeCleanup.default((exitCode: number | null, signal: string | null) => {
  closeServer();
  return undefined;
})
