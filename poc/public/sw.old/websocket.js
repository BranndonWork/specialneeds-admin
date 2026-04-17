// ./public/sw/websocket.js

class ClientNotificationManager {
  async notifyClients(type, payload = null) {
    const allClients = await self.clients.matchAll();
    allClients.forEach((client) => {
      client.postMessage({ type, payload });
    });
  }
}

class MessageQueueManager {
  constructor(context) {
    this.messageQueue = [];
    this.context = context;
  }

  processMessageQueue() {
    console.log("processMessageQueue", {
      socket: this.context.connectionManager.socket,
      readyState: this.context.connectionManager.socket?.readyState,
      messageQueue: this.messageQueue,
    });
    while (
      this.context.connectionManager.socket &&
      this.context.connectionManager.socket.readyState === WebSocket.OPEN &&
      this.messageQueue.length > 0
    ) {
      const message = this.messageQueue.shift();
      this.context.connectionManager.socket.send(message);
    }
  }

  enqueueMessage(payload) {
    console.log("enqueueMessage", { payload });
    this.messageQueue.push(payload);
    this.processMessageQueue();
  }
}

class WebSocketConnectionManager {
  constructor(context) {
    this.context = context;
    this.notificationManager = context.notificationManager;
    this.messageQueueManager = context.messageQueueManager;
    this.isConnecting = false;
    this.backoffTime = 100;
    this.maxBackoff = 5000;
    this.globalSocketUrl = null;
    this.socket = null;
  }

  initWebSocket(socketUrl) {
    console.log("initWebSocket", {
      socketUrl,
      socket: this.socket,
      readyState: this.socket?.readyState,
    });
    if (this.isConnecting && new Date().getTime() - this.isConnecting < 5000) {
      console.log("Already connecting...");
      setTimeout(() => {
        console.log("Retrying initWebSocket");
        this.initWebSocket(socketUrl);
      }, 1000);
      return;
    }
    console.log("Connecting?");
    this.isConnecting = new Date().getTime();
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log("Socket already open");
      this.isConnecting = false;
      return;
    }
    console.log("Connecting to", socketUrl);
    const webSocket = new WebSocket(socketUrl);

    webSocket.onopen = () => {
      console.log("Websocket onopen");
      this.isConnecting = false;
      this.globalSocketUrl = socketUrl;
      this.notificationManager.notifyClients("ws-status", "connected");
      this.context.messageQueueManager.processMessageQueue();
    };

    webSocket.onclose = (event) => {
      console.log("Websocket onclose", { event });
      this.notificationManager.notifyClients(
        "ws-status",
        event.wasClean ? "closed-cleanly" : "disconnected"
      );
      this.backoffTime = Math.min(this.backoffTime * 2, this.maxBackoff); // Increment backoff time
      setTimeout(() => this.initWebSocket(this.globalSocketUrl), this.backoffTime); // Reconnect after backoff time
    };

    webSocket.onmessage = (message) => {
      console.log("Websocket onmessage", { message });
      this.context.handleMessage(message);
    };

    webSocket.onerror = (event) => {
      console.log("Websocket onerror", { event });
      console.error("[serviceWorker] Websocket onerror: Server unavailable", event);
      // this.notificationManager.notifyClients("ws-status", "server-unavailable");
      // this.backoffTime = Math.min(this.backoffTime * 2, this.maxBackoff); // Increment backoff time
      // setTimeout(() => this.initWebSocket(this.globalSocketUrl), this.backoffTime); // Reconnect after backoff time
    };

    this.socket = webSocket;
    console.log("this.socket", this.socket);
  }

  autoReconnect() {
    if (
      this.socket.readyState === WebSocket.OPEN ||
      this.socket.readyState === WebSocket.CONNECTING
    )
      return;
    this.initWebSocket(this.globalSocketUrl);
    this.backoffTime = Math.min(this.backoffTime * 2, this.maxBackoff);
    setTimeout(() => this.autoReconnect(), this.backoffTime);
  }
}

class WebSocketManager {
  constructor() {
    this.notificationManager = new ClientNotificationManager();
    this.connectionManager = new WebSocketConnectionManager(this);
    this.messageQueueManager = new MessageQueueManager(this);
    this.requests = {};
    this.maxWaitTime = 30000;
  }

  sendMessage(payload) {
    const { requestId } = payload;
    console.log("sendMessage", {
      payload,
      requestId,
      socket: this.connectionManager.socket,
      readyState: this.connectionManager.socket?.readyState,
    });

    if (this.connectionManager.socket?.readyState === WebSocket.OPEN) {
      this.requests[requestId] = { startTime: new Date().getTime() };
      this.connectionManager.socket.send(JSON.stringify(payload));
      this.notificationManager.notifyClients("request-status", { requestId, status: "sent" });

      setTimeout(() => {
        if (this.requests[requestId]) {
          this.notificationManager.notifyClients("ws-message", {
            requestId,
            error: "Request timed out",
          });
          delete this.requests[requestId];
        }
      }, this.maxWaitTime);
    } else {
      this.connectionManager.initWebSocket(this.connectionManager.globalSocketUrl);
      this.messageQueueManager.enqueueMessage(payload);
      this.notificationManager.notifyClients("request-status", { requestId, status: "queued" });
      this.messageQueueManager.processMessageQueue();
    }
  }

  handleMessage(event) {
    const parsedData = JSON.parse(event.data);
    const { requestId } = parsedData;
    const endTime = new Date().getTime();
    const { startTime } = this.requests[requestId];
    const timeTaken = endTime - startTime;
    parsedData["round_trip_time"] = timeTaken / 1000;

    // Notify clients of request status
    this.notificationManager.notifyClients("request-status", {
      requestId,
      status: "received",
      data: parsedData,
    });
    this.notificationManager.notifyClients("ws-message", parsedData);
    delete this.requests[requestId];
  }
}

const webSocketManager = new WebSocketManager();

self.addEventListener("message", (event) => {
  if (event.data.type === "initialize") {
    const socketUrl = "ws://127.0.0.1:8000/ws/core/";
    webSocketManager.connectionManager.initWebSocket(socketUrl);
  } else if (event.data.type === "ws-send") {
    let { payload } = event.data;
    try {
      payload = JSON.parse(payload);
    } catch (e) {}
    webSocketManager.sendMessage(payload);
  }
});
