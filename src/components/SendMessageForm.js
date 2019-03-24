import React from 'react';
import '../style.css';

class SendMessageForm extends React.Component {
    constructor() {
        super();
        this.state = {
            message: []
        }
    }

    handleChange = (e) => {
        this.setState({
            message: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.sendMessage(this.state.message);
        this.setState({
            message: ''
        });
    }

    render() {
        return (
            <form className='send-message-form' onSubmit={this.handleSubmit}>
                <input
                    type='text'
                    placeholder='Type your message and hit ENTER'
                    disabled={this.props.disabled}
                    value={this.state.message}
                    onChange={this.handleChange} />
            </form>
        )
    }
}

export default SendMessageForm;