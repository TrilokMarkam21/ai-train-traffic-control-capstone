// ============================================================
// frontend/src/socket/socket.js  — AUTO DISCOVERY WITH LAZY INIT
// FIX 1: Socket initialization deferred until backend is discovered
// FIX 2: Handles port auto-detection gracefully
// FIX 3: Reconnection and error handling
// ============================================================

import { io } from "socket.io-client";

let socket = null;
let initPromise = null;

async function initSocket() {
  if (socket) return socket;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    console.log("🔌 Initializing Socket.IO...");

    // Try to get backend URL from localStorage (set by discovery service)
    let backendUrl = localStorage.getItem("backendUrl");

    if (!backendUrl) {
      console.log("🔍 Backend URL not cached, attempting discovery...");
      // Try to fetch config from common ports
      for (const port of [5000, 5001, 5002, 5003, 5004, 5005, 8000, 8001, 3000, 3001]) {
        try {
          const response = await fetch(`http://localhost:${port}/api/config`, {
            signal: AbortSignal.timeout(500),
          });
          if (response.ok) {
            const data = await response.json();
            backendUrl = data.data.backendUrl;
            localStorage.setItem("backendUrl", backendUrl);
            console.log(`✅ Backend found at: ${backendUrl}`);
            break;
          }
        } catch (e) {
          // Continue to next port
        }
      }
    } else {
      console.log(`📌 Using cached backend URL: ${backendUrl}`);
    }

    // In production: connect to same origin (frontend served from backend)
    // In development: use discovered/cached backend URL or localhost fallback
    const isProd = import.meta.env.PROD;
    const socketUrl = isProd
      ? (import.meta.env.VITE_API_URL || window.location.origin)
      : (backendUrl || import.meta.env.VITE_API_URL || "http://localhost:5000");
    console.log(`🔌 Socket.IO connecting to: ${socketUrl}`);

    socket = io(socketUrl, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("✅ [Socket.IO] Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.warn("⚠️  [Socket.IO] Connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ [Socket.IO] Disconnected:", reason);
    });

    socket.on("reconnect", (attempt) => {
      console.log("🔄 [Socket.IO] Reconnected after", attempt, "attempts");
    });

    return socket;
  })();

  return initPromise;
}

// Default lazy-initialized socket object
const socketProxy = {
  on: (event, handler) => {
    initSocket().then((s) => s?.on?.(event, handler));
  },
  off: (event, handler) => {
    initSocket().then((s) => s?.off?.(event, handler));
  },
  emit: (event, data) => {
    initSocket().then((s) => s?.emit?.(event, data));
  },
  connect: () => {
    initSocket().then((s) => s?.connect?.());
  },
  disconnect: () => {
    initSocket().then((s) => s?.disconnect?.());
  },
  get id() {
    return socket?.id || null;
  },
};

export default socketProxy;
export { initSocket };
