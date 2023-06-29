import React, { useEffect, useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import socket from './socket';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [stateUser, setStateUser] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isBool, setIsBool] = useState(true);
  const [messagesStory, setMessagesStory] = useState([]);
  const [currentMessagesStory, setCurrentMessagesStory] = useState([]);
  const [allRooms, setAllRooms] = useState([
    {
      name: 'user1',
      numberRoom: '1'
    },
    {
      name: 'user2',
      numberRoom: '2'
    },
    {
      name: 'user3',
      numberRoom: '3'
    },
    {
      name: 'user4',
      numberRoom: '4'
    },
    {
      name: 'user5',
      numberRoom: '5'
    },
    {
      name: 'user6',
      numberRoom: '6'
    }
  ]);

  const messageRef = useRef(null);
  
  useEffect(() => {
    socket.on('chat message',(data) =>{
      console.log('data',data);
      if(data) {
      setCurrentMessagesStory(state => [...state,data]);
      }
    });
  }, []);

  useEffect(() => {
    messageRef.current.scrollTo(0,99999)
  },[currentMessagesStory])

  console.log('currentMessagesStory',currentMessagesStory);

  const sendSocket = () => {
    socket.emit('Room: Join',{roomId});
    setIsBool(false)
  };
  
  const joinChatFunc = async (user) => {
    socket.emit('Room: Join',{
      roomId: user.numberRoom,
      user: user.name
    });
      await axios.post('http://localhost:4444/create-room',{
      messages: [],
      roomId: user.numberRoom,
    }) 
    .then((res) =>  setRoomId(res.data.roomId))
    setIsBool(false)
    setRoomId(user.numberRoom)
    
    await axios.get('http://localhost:4444/get-current-messages')
    .then((res) => res.data)
    .then((res) => {
      const resoult = res.filter((el) => el.roomId == user.numberRoom);
      console.log('resoult',resoult);
      setMessagesStory(resoult)
    })
  };

  console.log('messagesStory',messagesStory);

  const sendMessage = () => {
    const currentUser = allRooms.filter((user) => user.numberRoom == roomId);

    axios.patch('http://localhost:4444/add-message',{
      message,
      user: stateUser,
      id: roomId
    });
    setMessage('');
  }

  return (
    <div className="App">
      {isBool && <p>Всі кімнати</p>}
      {isBool && <input value={stateUser} placeholder='Ваше імя' onChange={(e) => setStateUser(e.target.value)}/>}
      {isBool &&
        allRooms.map((item, idx) => (
          <div key={idx} style={{ margin: "10px 0px" }}>
            <button onClick={() => joinChatFunc(item)}>Join{item.numberRoom}</button>
          </div>
        ))}
      <div className='message_wrapper' ref={messageRef}>
      <div>
        {messagesStory.length != 0 && messagesStory.map((el, idx) => (
          <div key={idx}>
            {el.messages.map((item) =>(
              <div key={item._id} className={item.user == stateUser ? 'active_user' : 'another_user'}>
                <p>Message: {item.message}</p>
                <p style={{color:'grey', fontSize:'11px'}}>User: {item.user}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        {currentMessagesStory.length != 0 && currentMessagesStory.map((el, idx) => (
          <div key={idx} className={el.user == stateUser ? 'active_user' : 'another_user'}>
                <p>Message: {el.mes}</p>
                <p style={{color:'grey', fontSize:'11px'}}>User: {el.user}</p>
          </div>
        ))}
      </div>
      </div>
      {!isBool && (
        <div style={{marginTop:'20px'}}>
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>відправити повідомлення</button>
        </div>
      )}
    </div>
  );
}

export default App;