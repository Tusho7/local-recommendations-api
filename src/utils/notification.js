import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();


const port = process.env.WS_PORT || 8081;
const wsServer = new WebSocketServer({ port });

const clients = new Set();

wsServer.on('connection', (ws) => {
  console.log('WebSocket client connected');
  clients.add(ws);

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
    clients.delete(ws);
  });
});

export const broadcastNotification = (message) => {
    clients.forEach((client) => {
        if (client.readyState === WebSocketServer.OPEN) {
            client.send(JSON.stringify(message));
        }
    })
}

export default wsServer;