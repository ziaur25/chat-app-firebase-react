import React from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {userAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase initializeApp({
  // my config from google firebase
  apiKey: "AIzaSyBabaVPAJc-lAOiA5hpUnAFfPfMuu4ngDI",
  authDomain: "superchat-app1.firebaseapp.com",
  databaseURL: "https://superchat-app1.firebaseio.com",
  projectId: "superchat-app1",
  storageBucket: "superchat-app1.appspot.com",
  messagingSenderId: "472710958052",
  appId: "1:472710958052:web:4eeb8d32e7406500d695f1"

});

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

const [user] = userAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">



      <section>
        {user ? <ChatRoom />  : <SignIn />}
      </section>


      </header>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return(
    <button onClick={signInWithGoogle}> SignIn with Google</button>
  );
}


function SignOut() {
  return auth.currentUser && (
    <button onClick={()=> auth.signOut()}> Sign Out </button>
  )
}


function ChatRoom() {

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  //for the form
  const [formValue, setFormValue] = useState('');


  const sendMessage = async(e) => {
    e.preventDefault();
    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormValue('');

  }


  return (
    //list of messages
    <div>
      {messages && messages.map(msg => <ChatMessage key={msg.id}  message={msg} /> )}
    </div>

    //user input of new message
    <form onSubmit={sendMessage}>
    <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
    <button type="submit">Send</button>
    </form>


  )

}

function ChatMessage(props){
const {text, uid} = props.message;

const messageClass = uid === auth.currentUser.uid ? 'sent': 'received';

return(

  <div className={`message ${messageClass}`}>
  <p> {text} </p>
  </div>
)

}

export default App;
