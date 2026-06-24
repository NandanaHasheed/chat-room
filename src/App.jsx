import { useState, useEffect } from "react";


import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";


import {
  signInWithPopup,
  signInAnonymously
} from "firebase/auth";


import {
  db,
  auth,
  provider
} from "./firebase";


import "./index.css";



function App(){


const [name,setName] = useState("");

const [message,setMessage] = useState("");

const [room,setRoom] = useState("general");

const [messages,setMessages] = useState([]);



useEffect(()=>{


const q = query(

collection(
db,
"rooms",
room,
"messages"
),

orderBy("time")

);



const unsubscribe = onSnapshot(
q,
(snapshot)=>{


setMessages(

snapshot.docs.map(doc=>({

id:doc.id,

...doc.data()

}))

);


});


return unsubscribe;


},[room]);






const googleLogin = ()=>{


signInWithPopup(
auth,
provider
)

.then((result)=>{

setName(
result.user.displayName
);


})

.catch(error=>{

console.log(error);

});


};






const sendMessage = async()=>{


if(!name || !message)
return;



await addDoc(

collection(
db,
"rooms",
room,
"messages"
),

{

name,

message,

time:Date.now()

}

);



setMessage("");



};






const guestLogin = ()=>{


signInAnonymously(auth)

.then(()=>{

setName("Guest");

});


};





return (

<div className="chat-container">



<h1>
💬 Chat Room
</h1>




<button onClick={googleLogin}>
Login with Google
</button>


<button 
className="guest"
onClick={guestLogin}
>
Continue as Guest
</button>




<div className="rooms">


<button onClick={()=>setRoom("general")}>
General
</button>


<button onClick={()=>setRoom("coding")}>
Coding
</button>


<button onClick={()=>setRoom("random")}>
Random
</button>


</div>





<input

placeholder="Your name"

value={name}

onChange={(e)=>setName(e.target.value)}

/>





<h3>
Room: {room}
</h3>





<div className="messages">



{

messages.map(msg=>(


<div
className="message"
key={msg.id}
>


<b>
{msg.name}
</b>


<p>
{msg.message}
</p>


</div>



))

}




</div>





<input


placeholder="Type message..."


value={message}


onChange={(e)=>setMessage(e.target.value)}


/>



<button onClick={sendMessage}>
Send
</button>



</div>


);



}


export default App;