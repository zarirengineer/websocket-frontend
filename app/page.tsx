"use client";
import { useState, useEffect } from "react";
import { connectWebSocket, sendWebSocketMessage } from "@/lib/websocket";
import WebSocketForm from "@/components/WebSocketForm";

export default function Home() {
  const [interval, setInterval] = useState("1s");
  const [instrument, setInstrument] = useState("");
  const [exchange, setExchange] = useState("");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    connectWebSocket("wss://websocket-backend.up.railway.app/ws", setData);
  }, []);

  const handleSubmit = () => {
    sendWebSocketMessage({ interval, instrument, exchange });
  };

  return (
    <main className="p-4">
      {/* WebSocket Form Component */}
      <WebSocketForm />

      {/* WebSocket Client UI */}
      <div className="p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">WebSocket Client</h1>
        <input
          className="border p-2 w-full my-2"
          placeholder="Instrument"
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
        />
        <input
          className="border p-2 w-full my-2"
          placeholder="Exchange"
          value={exchange}
          onChange={(e) => setExchange(e.target.value)}
        />
        <select
          className="border p-2 w-full my-2"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
        >
          <option value="1s">1s</option>
          <option value="5s">5s</option>
          <option value="10s">10s</option>
        </select>
        <button
          className="bg-blue-500 text-white p-2 rounded w-full"
          onClick={handleSubmit}
        >
          Subscribe
        </button>
        <pre className="mt-4 p-4 border">
          {data ? JSON.stringify(data, null, 2) : "Waiting for data..."}
        </pre>
      </div>
    </main>
  );
}
