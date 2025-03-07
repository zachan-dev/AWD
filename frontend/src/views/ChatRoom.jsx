// ChatRoom.js
import React, { useContext, useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { Button, Form, ListGroup, Badge } from "react-bootstrap";

import UserData from "./plugin/UserData";
import { ProfileContext } from "./plugin/Context";

const ChatRoom = ({ courseId, role }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useContext(ProfileContext);

  // Update the socketUrl if your backend is hosted differently
  const socketUrl = `ws://localhost:8000/ws/chat/${courseId}/`;
  const { sendMessage, lastMessage } = useWebSocket(socketUrl, {
    shouldReconnect: (closeEvent) => true,
  });

  // When a new WebSocket message arrives, add it to the chatMessages array
  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);
        setChatMessages((prev) => [...prev, data]);
      } catch (e) {
        console.error("Error parsing incoming message:", e);
      }
    }
  }, [lastMessage]);

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      // For demo, we simulate a message from the current user
      const msgObj = {
        sender: profile?.full_name || "User",
        role,
        time: new Date().toLocaleTimeString(),
        text: message,
      };
      sendMessage(JSON.stringify(msgObj));
    }
  };

  return (
    <div>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          height: "300px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
          background: "#f8f9fa",
        }}
      >
        <ListGroup variant="flush">
          {chatMessages.map((msg, idx) => (
            <ListGroup.Item key={idx} className="border-0">
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{msg.sender}</strong>{" "}
                  <Badge bg="secondary">{msg.role}</Badge>
                </div>
                <small className="text-muted">{msg.time}</small>
              </div>
              <div className="mt-1">
                <div
                  className="p-2 rounded"
                  style={{ backgroundColor: "#e9ecef", display: "inline-block" }}
                >
                  {msg.text}
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <div className="d-flex">
        <Form.Control
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <Button variant="primary" onClick={handleSendMessage} className="ms-2">
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatRoom;
