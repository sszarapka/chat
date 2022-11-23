import React, { FC } from 'react';
import { Avatar, Comment } from 'antd';
import './Message.scss';

type Time = {
  toDate(): Date;
  seconds: number;
  nanosecods: number;
};

type MessageType = {
  name: string;
  value: string;
  uid: string;
  photo: string;
  time: Time;
  currentUid: string;
};

const Message: FC<MessageType> = ({
  name,
  value,
  uid,
  photo,
  time,
  currentUid,
}) => {
  const messageTime = new Date(time?.toDate()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  return (
    <Comment
      className="message"
      author={name}
      avatar={<Avatar src={photo} alt="profile picture" />}
      content={
        <p
          className={
            currentUid === uid ? 'message-content active' : 'message-content'
          }
        >
          {value}
        </p>
      }
      datetime={<span>{messageTime}</span>}
    />
  );
};

export default Message;
