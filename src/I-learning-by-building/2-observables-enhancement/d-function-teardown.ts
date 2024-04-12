import { Observer } from "./b-errors-and-partial";
import WebSocket from "ws";

const observable = (subscriber: Observer<string>) => {
  const socket = new WebSocket("wss://echo.websocket.org");

  socket.onopen = () => {
    socket.send("Hello, World!");
  };

  socket.onmessage = (e) => {
    subscriber.next(`Message from socket: ${e.data.toString()}`);
  };

  socket.onclose = (e) => {
    if (e.wasClean) {
      subscriber.complete();
    } else {
      subscriber.error(new Error("Socket closed dirty!"));
    }
  };

  return () => {
    if (socket.readyState <= WebSocket.OPEN) {
      socket.close();
    }
  };
};

// Call site
const teardown = observable({
  next: console.log,
  complete: () => console.log("done with web socket"),
  error: console.error,
});

// When done with the web socket, tear it down
setTimeout(() => teardown(), 2000);
