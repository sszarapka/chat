import React, { createRef, useEffect } from "react";
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
import CurrentDate from "./CurrentDate";
import "./Chat.scss";

const Chatv2 = (userData: any) => {
  const inputRef = createRef<any>();
  const scrollPoint = createRef<any>();

  const messagesRef = collection(getFirestore(), "messages");
  const messagesQuery = query(messagesRef, orderBy("time"));

  // { idField: "id" }
  const [messages] = useCollectionData(messagesQuery);

  const messagesItems = messages?.map((item, i) => {
    const currentDate = new Date(item.time?.toDate()).toLocaleDateString();
    const nextDate = new Date(
      messages[i - 1]?.time.toDate()
    ).toLocaleDateString();
    return (
      <>
        {currentDate !== nextDate && (
          <CurrentDate date={messages[0].time.toDate().toLocaleDateString()} />
        )}
        <Message
          name={item.name}
          value={item.value}
          uid={item.uid}
          photo={item.photo}
          time={item.time}
          key={item.time.seconds}
          currentUid={userData.userData.uid}
        />
      </>
    );
  });

  const sendMessage = async (e: any) => {
    const message = inputRef.current.resizableTextArea.textArea.value;
    e.preventDefault();
    if ((e.shiftKey && e.which === 13) || message === "") return;

    try {
      await addDoc(collection(getFirestore(), "messages"), {
        name: userData.userData.name,
        value: message,
        uid: userData.userData.uid,
        photo: userData.userData.photo,
        time: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    // NULL
    // inputRef.current.resizableTextArea.textArea.value = "";
    // console.log(scrollPoint.current);
    scrollPoint.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(
    () => scrollPoint.current.scrollIntoView({ behavior: "smooth" }),
    [scrollPoint]
  );

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
            autoSize={{ minRows: 1, maxRows: 6 }}
          />
          <Button
            type="primary"
            className="send-button"
            onClick={sendMessage}
            // onClick={() =>
            //   (inputRef.current.resizableTextArea.textArea.value = "")
            // }
          >
            <SendOutlined />
          </Button>
        </Input.Group>
      </div>
    </main>
  );
};

export default Chatv2;
