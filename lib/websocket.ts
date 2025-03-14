let socket: WebSocket | null = null;

export const connectWebSocket = (url: string, onMessage: (data: any) => void) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    socket = new WebSocket(url);

    socket.onopen = () => console.log("WebSocket connected");
    socket.onmessage = (event) => onMessage(JSON.parse(event.data));
    socket.onerror = (error) => console.error("WebSocket Error", error);
    socket.onclose = () => console.log("WebSocket disconnected");
  }
};

export const sendWebSocketMessage = (message: object) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
};
