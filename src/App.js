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
  const [allMessages, setAllMessages] = useState([]);
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
    },
    {
      name: 'user7',
      numberRoom: '7'
    },
    {
      name: 'user8',
      numberRoom: '8'
    },
    {
      name: 'user9',
      numberRoom: '9'
    },
    {
      name: 'user10',
      numberRoom: '10'
    },
    {
      name: 'user11',
      numberRoom: '11'
    },
    {
      name: 'user12',
      numberRoom: '12'
    },
    {
      name: 'user13',
      numberRoom: '13'
    },
    {
      name: 'user14',
      numberRoom: '14'
    },
    {
      name: 'user15',
      numberRoom: '15'
    },
    {
      name: 'user16',
      numberRoom: '16'
    },
    {
      name: 'user17',
      numberRoom: '17'
    },
    {
      name: 'user18',
      numberRoom: '18'
    },
    {
      name: 'user19',
      numberRoom: '19'
    },
    {
      name: 'user20',
      numberRoom: '20'
    },
    {
      name: 'user21',
      numberRoom: '21'
    },
    {
      name: 'user22',
      numberRoom: '22'
    },
    {
      name: 'user23',
      numberRoom: '23'
    },
    {
      name: 'user24',
      numberRoom: '24'
    },
    {
      name: 'user25',
      numberRoom: '25'
    },
    {
      name: 'user26',
      numberRoom: '26'
    },
    {
      name: 'user27',
      numberRoom: '27'
    },
    {
      name: 'user28',
      numberRoom: '28'
    },
    {
      name: 'user29',
      numberRoom: '29'
    },
    {
      name: 'user30',
      numberRoom: '30'
    },
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
      setAllMessages([...messagesStory,...currentMessagesStory])
  },[currentMessagesStory, messagesStory])

  useEffect(() => {
    messageRef.current.scrollTo(0,99999)
  },[allMessages])

  const sendSocket = () => {
    socket.emit('Room: Join',{roomId});
    setIsBool(false)
  };
  
  const joinChatFunc = async (user) => {
    if(!stateUser) {
      return alert('Введіть імя користувача')
    }
    socket.emit('Room: Join',{
      roomId: user.numberRoom,
      user: user.name
    });
      await axios.post('https://chat-server-ros-a1684ddf6fd2.herokuapp.com/create-room',{
      messages: [],
      roomId: user.numberRoom,
    }) 
    .then((res) =>  setRoomId(res.data.roomId))
    setIsBool(false)
    setRoomId(user.numberRoom)
    
    await axios.get('https://chat-server-ros-a1684ddf6fd2.herokuapp.com/get-current-messages')
    .then((res) => res.data)
    .then((res) => {
      const resoult = res.filter((el) => el.roomId == user.numberRoom);
      console.log('resoult',resoult[0]?.messages);
      setMessagesStory(resoult[0]?.messages)
    })
  };

  console.log('messagesStory',messagesStory);

  const sendMessage = () => {
    const currentUser = allRooms.filter((user) => user.numberRoom == roomId);

    axios.patch('https://chat-server-ros-a1684ddf6fd2.herokuapp.com/add-message',{
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
      {!isBool && allMessages.length != 0 && allMessages.map((message, idx) => (
        <div key={idx} className={message.user == stateUser ? 'active_user' : 'another_user'}>
                <p>{message.user}: {message.message}</p>
                <p style={{color:'grey', fontSize:'11px'}}>User: {message.user}</p>
        </div>
      ))}
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