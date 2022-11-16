import React from "react";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";

import Chat from "./components/Chat";
import Chatv2 from "./components/Chatv2";
import SignIn from "./components/SignIn";

import "./App.scss";

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyB8JgS1BXh_aVXI1lnrUYeMTo0KiCSEjh8",
    authDomain: "chat-app-be7d3.firebaseapp.com",
    projectId: "chat-app-be7d3",
    storageBucket: "chat-app-be7d3.appspot.com",
    messagingSenderId: "355357775057",
    appId: "1:355357775057:web:e3a1d2eeaf51c9fbdfa1f0",
  };
  initializeApp(firebaseConfig);

  const [user] = useAuthState(getAuth());

  const userData = {
    name: user?.displayName,
    photo: user?.photoURL,
    uid: user?.uid,
  };

  return (
    <main className={user ? "container" : "container signin"}>
      {user ? <Chatv2 userData={userData} /> : <SignIn />}
    </main>
  );
}

export default App;
