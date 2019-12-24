import React             from 'react';
import { SocketContext } from '../socketProvider';

export default function withSocket (Component) {
	return function WithSocketComponent (props) {
		return (
			<SocketContext.Consumer>
				{socket => <Component {...props} socket={socket} />}
			</SocketContext.Consumer>
		);
	}
}
