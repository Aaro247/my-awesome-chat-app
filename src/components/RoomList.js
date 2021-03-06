import React from 'react';
import '../style.css';

class RoomList extends React.Component {
    render() {
        const orderedRooms = [...this.props.rooms].sort((a, b) => a.id - b.id)
        return (
            <div className='rooms-list'>
                <ul>
                    <h3 style={{ color: '#E8E8E8' }}>Your Rooms:</h3>
                    {orderedRooms.map((room) => {
                        const active = this.props.currentRoomId === room.id ? '-active' : '';
                        return (
                            <li key={room.id} className={'room' + active}>
                                <a href="#" onClick={() => this.props.subscribeToRoom(room.id)}># {room.name}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default RoomList;