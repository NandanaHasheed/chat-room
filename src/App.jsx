import { useState, useEffect } from "react";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  setDoc,
  doc
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

const [rooms,setRooms] = useState([]);

const [newRoom,setNewRoom] = useState("");

const [messages,setMessages] = useState([]);




// load rooms

useEffect(()=>{


const unsubscribe = onSnapshot(

collection(db,"rooms"),

(snapshot)=>{


if(snapshot.empty){

[
"general",
"coding",
"random"
].forEach(async(r)=>{

await setDoc(
doc(db,"rooms",r),
{
name:r
}
);

});

}


setRooms(

snapshot.docs.map(
doc=>doc.id
)

);


}

);


return unsubscribe;


},[]);






// load messages


useEffect(()=>{


const q = query(

collection(
db,
"rooms",
room,
"messages"
),

orderBy(
"time"
)

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


}


);


return unsubscribe;


},[room]);








const googleLogin=()=>{


signInWithPopup(
auth,
provider
)

.then(result=>{

setName(
result.user.displayName
);

});


};







const guestLogin=()=>{


signInAnonymously(auth)

.then(()=>{

setName("Guest");

});


};








const createRoom=async()=>{


const r = newRoom
.trim()
.toLowerCase();



if(!r)
return;



await setDoc(

doc(
db,
"rooms",
r
),

{
name:r
}

);



setRoom(r);

setNewRoom("");


};









const sendMessage=async()=>{


if(!message || !name)
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


{

rooms.map(r=>(

<button

key={r}

onClick={()=>setRoom(r)}

>

{r}

</button>

))

}


</div>






<input

placeholder="Create new room"

value={newRoom}

onChange={
e=>setNewRoom(e.target.value)
}

/>


<button onClick={createRoom}>
Create Room
</button>





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

onChange={
e=>setMessage(e.target.value)
}

/>



<button onClick={sendMessage}>
Send
</button>



</div>

);


}


export default App;