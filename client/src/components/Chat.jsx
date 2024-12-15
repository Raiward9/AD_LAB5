import { useContext, useState } from "react";
import { UserContext } from "./UserContext";

// TODO: fer que funcioni
export default function Chat({ chatId }) {

  const { user } = useContext(UserContext)
  const { userId } = user // mirar com esta guardat a UserContext

  const [messages, setMessages] = useState([])
  const ws = new WebSocket(`ws://localhost:8765?chat=${chatId}&userId=${userId}`);

  ws.onopen = () => {
    console.log("Connected to server");
  };

  ws.onmessage = (event) => {
      setMessages([...messages, `Server: ${event.data}`])
  };

  ws.onclose = () => {
      console.log("Disconnected from server");
  };

  ws.onerror = (error) => {
      console.error("WebSocket error:", error);
  };

  document.getElementById("disconnectButton").addEventListener("click", () => {
    ws.close()
  });

  return (
    <div>
      <h1>WebSocket Client</h1>
      <h2>Chat 1</h2>
      <input type="text" id="messageInput" placeholder="Enter message" />
      <input type="text" id="userId" placeholder="Enter userId" />
      <input type="file" id="imageInput" placeholder="Enter image" accept="image/*" />
      
      <button id="sendButton">Send</button>
      <button id="disconnectButton">Disconnect</button>
      <button id="ChangeUserIdButton">Change User Id</button>
      <div id="output">
        {
          messages.map((item, index) => {
            <li key={index}>{item}</li>
          })
        }
      </div>
    </div>
  )
}
