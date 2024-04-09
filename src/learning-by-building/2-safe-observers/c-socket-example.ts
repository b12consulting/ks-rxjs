import { Observable } from "./a-safe-observer";

const helloSocket = new Observable<string>((subscriber) => {
  // Open a socket.
  const socket = new WebSocket("wss://echo.websocket.org");

  socket.onopen = () => {
    // Once it's open, send some text.
    socket.send("Hello, World!");
  };

  socket.onmessage = (e) => {
    // When it echoes the text back (in the case of this particular server)
    // notify the consumer.
    subscriber.next(e.data);
  };

  socket.onclose = (e) => {
    // Oh! we closed!
    if (e.wasClean) {
      // ...because the server said it was done.
      subscriber.complete();
    } else {
      // ...because of something bad. Maybe we lost network or something.
      subscriber.error(new Error("Socket closed dirty!"));
    }
  };
});

// Start the websocket and log the echoes
helloSocket.subscribe({
  next: console.log,
  complete: () => console.log("server closed"),
  error: console.error,
});