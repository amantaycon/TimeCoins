import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketContext = createContext();

// helper to get JWT from localStorage
const getToken = () => localStorage.getItem("jwtToken");

export const WebSocketProvider = ({ children }) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socket = new SockJS("http://localhost:9090/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        if (str.includes("CONNECTED")) {
          console.log("✅ STOMP connected");
        } else if (str.includes("ERROR")) {
          console.error("❌ STOMP error", str);
        }
      },
      reconnectDelay: 5000,
      onConnect: (frame) => {
        const userId = frame.headers["user-name"];
        const version = frame.headers["version"];
        const heartbeat = frame.headers["heart-beat"];

        console.log(
          `✅ WebSocket connected (userId=${userId}, version=${version}, heartbeat=${heartbeat})`
        );
        setConnected(true);
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame.headers["message"], frame.body);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  const subscribe = (destination, callback) => {
    if (clientRef.current && connected) {
      return clientRef.current.subscribe(destination, (message) => {
        callback(JSON.parse(message.body));
      });
    }
    return null;
  };

  const sendMessage = (destination, body) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({ destination, body: JSON.stringify(body) });
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ client: clientRef.current, subscribe, sendMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
