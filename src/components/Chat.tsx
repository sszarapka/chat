import React, { createRef, useEffect, FC } from "react";
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

import { Input, Button, Typography, Form } from "antd";

import { SendOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import Message from "./Message";
import CurrentDate from "./CurrentDate";
import "./Chat.scss";

// type chatProps = {
//   name: string;
//   photo: string;
//   uid: string;
// };

const Chatv2: FC<any> = userData => {
  const inputRef = createRef<any>();
  const scrollPoint = createRef<any>();

  const messagesRef = collection(getFirestore(), "messages");
  const messagesQuery = query(messagesRef, orderBy("time"));

  const [messages] = useCollectionData(messagesQuery);

  const messagesItems = messages?.map((item, i) => {
    const currentDate = new Date(item.time?.toDate()).toLocaleDateString();
    const prevDate = new Date(
      messages[i - 1]?.time.toDate()
    ).toLocaleDateString();

    return (
      <>
        {currentDate !== prevDate && <CurrentDate date={currentDate} />}
        <Message
          name={item.name}
          value={item.value}
          uid={item.uid}
          photo={item.photo}
          time={item.time}
          key={uuidv4()}
          currentUid={userData.userData.uid}
        />
      </>
    );
  });

  const [form] = Form.useForm();
  const sendMessage = async (e: any) => {
    const message = inputRef.current.resizableTextArea.textArea.value;
    e.preventDefault();
    if ((e.shiftKey && e.which === 13) || message === "") {
      return;
    }

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

    form.setFieldsValue({
      text: "",
    });
  };

  useEffect(() => {
    scrollPoint.current.scrollIntoView({ behavior: "smooth" });
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
        <Form className="input-group" form={form} onFinish={sendMessage}>
          <Form.Item name="text" className="input-item">
            <Input.TextArea
              className="input"
              placeholder="Napisz wiadomość"
              onPressEnter={sendMessage}
              ref={inputRef}
              autoSize={{ minRows: 1, maxRows: 6 }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="send-button"
              onClick={sendMessage}
            >
              <SendOutlined />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </main>
  );
};

export default Chatv2;
