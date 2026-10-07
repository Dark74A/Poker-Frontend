const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const socketBase = apiBase.replace(/\/api\/?$/, "");

function encodeFrame(command, headers = {}, body = "") {
  const headerText = Object.entries(headers)
    .map(([key, value]) => `${key}:${value}`)
    .join("\n");
  return `${command}\n${headerText}\n\n${body}\u0000`;
}

export function connectToSessionUpdates(sessionId, onUpdate, onStatus = () => {}) {
  const token = localStorage.getItem("ledger_token");
  if (!token) {
    onStatus("disconnected");
    return () => {};
  }

  let active = true;
  let socket;
  let reconnectTimer;
  let reconnectDelay = 1000;

  const connect = () => {
    if (!active) return;
    const server = Math.random().toString(36).slice(2, 6);
    const session = Math.random().toString(36).slice(2, 10);
    socket = new WebSocket(`${socketBase}/ws/${server}/${session}/websocket`);

    socket.onopen = () => {
      // SockJS requires the opening frame before STOMP traffic.
    };

    socket.onmessage = ({ data }) => {
      const sockFrames = String(data).startsWith("a")
        ? JSON.parse(String(data).slice(1))
        : [];
      if (String(data) === "o") {
        socket.send(JSON.stringify([encodeFrame("CONNECT", {
          "accept-version": "1.2",
          "heart-beat": "0,0",
          Authorization: `Bearer ${token}`,
        })]));
        return;
      }
      if (String(data) === "h") return;
      for (const sockFrame of sockFrames) for (const frame of String(sockFrame).split("\u0000")) {
        if (!frame.trim()) continue;
        const separator = frame.indexOf("\n\n");
        if (separator < 0) continue;
        const command = frame.slice(0, frame.indexOf("\n"));
        const headerLines = frame.slice(frame.indexOf("\n") + 1, separator);
        const headers = Object.fromEntries(headerLines.split("\n").map((line) => {
          const colon = line.indexOf(":");
          return [line.slice(0, colon), line.slice(colon + 1)];
        }));
        if (command === "CONNECTED") {
          reconnectDelay = 1000;
          socket.send(JSON.stringify([encodeFrame("SUBSCRIBE", {
            id: `session-${sessionId}`,
            destination: `/topic/sessions/${sessionId}`,
            ack: "auto",
          })]));
          onStatus("connected");
        } else if (command === "MESSAGE") {
          try {
            onUpdate(JSON.parse(frame.slice(separator + 2)));
          } catch {
            // Ignore malformed broker messages.
          }
        } else if (command === "ERROR") {
          socket.close();
        }
      }
    };

    socket.onclose = () => {
      onStatus("disconnected");
      if (active) {
        reconnectTimer = setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 30000);
      }
    };
    socket.onerror = () => socket.close();
  };

  connect();
  return () => {
    active = false;
    clearTimeout(reconnectTimer);
    socket?.close();
  };
}
