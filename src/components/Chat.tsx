import React, { useRef, useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { Input, Button, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";

import Message from "./Message";
import "./Chat.scss";

const Chat = (userData: any) => {
  const inputRef = useRef<any>(null);
  const scrollPoint = useRef<any>(null);

  const [messageContent, setMessageContent] = useState<string>("");

  const messagesRef = collection(getFirestore(), "messages");
  const messagesQuery = query(messagesRef, orderBy("time"));
  const [messages] = useCollectionData(messagesQuery);

  const messagesItems = messages?.map(item => {
    return (
      <Message
        name={item.name}
        value={item.value}
        uid={item.uid}
        photo={item.photo}
        time={item.time}
        key={item.time}
        currentUid={userData.userData.uid}
      />
    );
  });

  const sendMessage = async (e: any) => {
    const message = inputRef.current.resizableTextArea.textArea.value;
    e.preventDefault();
    if ((e.shiftKey && e.which === 13) || message === "") return;

    try {
      await addDoc(collection(getFirestore(), "messages"), {
        name: userData.userData.name,
        value: messageContent,
        uid: userData.userData.uid,
        photo: userData.userData.photo,
        time: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setMessageContent("");
    window.scrollBy(0, 10000);
    scrollPoint.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    window.scrollBy(0, 100);
    scrollPoint.current.scrollIntoView({ behavior: "smooth" });
    window.scroll();
  }, [scrollPoint]);

  return (
    <main className="chat">
      <header className="header">
        <div className="header-container">
          <Typography.Title className="title" level={3}>
            Wiadomości
          </Typography.Title>
          <Button
            size="small"
            className="log-out"
            onClick={() => getAuth().signOut()}
          >
            Wyloguj się
          </Button>
        </div>
      </header>

      <section className="messages-container">{messagesItems}</section>
      <span ref={scrollPoint}></span>

      <div className="input-container">
        <Input.Group className="input-group">
          <Input.TextArea
            className="input"
            placeholder="Napisz wiadomość"
            onPressEnter={sendMessage}
            ref={inputRef}
            value={messageContent}
            onChange={e => setMessageContent(e.target.value)}
            autoSize={{ minRows: 1, maxRows: 6 }}
          />
          <Button type="primary" className="send-button" onClick={sendMessage}>
            <SendOutlined />
          </Button>
        </Input.Group>
      </div>
    </main>
  );
};

export default Chat;
