"use client";

import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface FormData {
    interval: string;
    instrument: string;
    exchange: string;
}

interface WebSocketData {
    time: string;
    price: number;
}

const WebSocketForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        interval: "1m",
        instrument: "BTC/USD",
        exchange: "Binance",
    });

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [chartData, setChartData] = useState<WebSocketData[]>([]);

    useEffect(() => {
        const ws = new WebSocket("wss://websocket-backend.up.railway.app/ws");

        ws.onopen = () => console.log("WebSocket Connected");
        ws.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data);

                if (parsedData.price && parsedData.time) {
                    setChartData((prevData) => [...prevData.slice(-20), parsedData]); // Keep last 20 entries
                }

                setMessages((prev) => [...prev, event.data]);
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        ws.onerror = (error) => console.error("WebSocket Error:", error);
        ws.onclose = () => console.log("WebSocket Disconnected");

        setSocket(ws);
        return () => ws.close();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (socket) socket.send(JSON.stringify(formData));
    };

    return (
        <div className="p-4 max-w-lg mx-auto">
            <h2 className="text-xl font-bold mb-4">WebSocket Config</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="block text-sm font-medium">Time Interval:</label>
                    <select name="interval" value={formData.interval} onChange={handleChange} className="border p-2 w-full">
                        <option value="1m">1m</option>
                        <option value="5m">5m</option>
                        <option value="15m">15m</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium">Instrument:</label>
                    <input type="text" name="instrument" value={formData.instrument} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Exchange:</label>
                    <input type="text" name="exchange" value={formData.exchange} onChange={handleChange} className="border p-2 w-full" />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Submit</button>
            </form>

            {/* Live Chart */}
            <div className="mt-6 p-4 bg-gray-100 rounded">
                <h3 className="font-bold mb-2">Live Price Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="price" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Live Messages */}
            <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="font-bold">Live Messages</h3>
                <ul className="text-sm overflow-auto h-32">
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WebSocketForm;
