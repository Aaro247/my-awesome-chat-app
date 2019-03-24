import React from 'react';
import Chatkit from '@pusher/chatkit-client';
import MessageList from './components/MessageList';
import NewRoomForm from './components/NewRoomForm';
import RoomList from './components/RoomList';
import SendMessageForm from './components/SendMessageForm';
import './style.css';
import { instanceLocator, tokenUrl } from './config';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            roomId: null,
            messages: [],
            joinableRooms: [],
            joinedRooms: []
        }
    }

    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator,
            userId: 'Aaro',
            tokenProvider: new Chatkit.TokenProvider({
                url: tokenUrl
            })
        })

        chatManager.connect()
            .then(currentUser => {
                this.currentUser = currentUser;
                this.getRooms();
            })
            .catch(err => console.log('error on roomSubscription: ', err));
    }

    subscribeToRoom = (roomId) => {
        this.setState({ messages: [] });
        this.currentUser.subscribeToRoomMultipart({
            roomId,
            hooks: {
                onMessage: message => {
                    message.parts.map((m) => {
                        this.setState({
                            messages: [...this.state.messages, Object.assign({}, {id: message.id}, {senderId: message.senderId}, {text: m.payload.content})]
                        });
                    })  
                }
            }
        })
        .then(room => {
            this.setState({ roomId: room.id });
            this.getRooms();
        })
        .catch(err => console.log('error on subscribing to room: ', err));
    }

    getRooms = () => {
        this.currentUser.getJoinableRooms()
            .then(joinableRooms => {
                this.setState({
                    joinableRooms,
                    joinedRooms: this.currentUser.rooms
                });
            })
            .catch(err => console.log('error on joinableRooms: ', err));
    }

    sendMessage = (text) => {
        this.currentUser.sendMessage({
            text,
            roomId: this.state.roomId
        })
    }

    createNewRoom = (roomName) => {
        this.currentUser.createRoom({
            name: roomName
        }).then(room => {
            this.subscribeToRoom(room.id)
        }).catch(err => console.log('error in new room creation: ', err));
    }

    render() {
        return (
            <div className='app'>
                <RoomList 
                    currentRoomId={this.state.roomId}
                    rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
                    subscribeToRoom={this.subscribeToRoom} />
                <MessageList 
                    messages={this.state.messages} 
                    roomId={this.state.roomId} />
                <SendMessageForm 
                    disabled={!this.state.roomId}
                    sendMessage={this.sendMessage} />
                <NewRoomForm createNewRoom={this.createNewRoom} />
            </div>
        )
    }
}

export default App;