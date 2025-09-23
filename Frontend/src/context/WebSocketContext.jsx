import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebSocketContext = createContext();
const getToken = () => localStorage.getItem('jwtToken');

export const WebSocketProvider = ({ children }) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = new SockJS('http://localhost:9090/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      debug: (str) => {
        if (str.includes("CONNECTED")) {
          console.log("✅ STOMP connected");
        } else if (str.includes("ERROR")) {
          console.error("❌ STOMP error", str);
        }
      },
      onConnect: () => {
        console.log("✅ WebSocket connected");
        setConnected(true);
      },
      onDisconnect: () => {
        console.log("❌ WebSocket disconnected");
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error("STOMP Error:", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, []);

  const subscribe = useCallback((destination, callback) => {
    if (clientRef.current && connected) {
      return clientRef.current.subscribe(destination, (message) => {
        callback(JSON.parse(message.body));
      });
    }
    return null;
  }, [connected]);

  const sendMessage = useCallback((destination, body) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({ destination, body: JSON.stringify(body) });
    }
  }, [connected]);

  return (
    <WebSocketContext.Provider value={{ client: clientRef.current, subscribe, sendMessage, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
