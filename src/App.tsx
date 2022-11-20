import React from "react";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";

import Chatv2 from "./components/Chat";
import SignIn from "./components/SignIn";
import { firebaseConfig } from "./firebase-config";

import "./App.scss";

function App() {
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
