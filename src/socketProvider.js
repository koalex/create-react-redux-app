import React, {
	useState,
	useEffect
} from 'react';
import * as io from 'socket.io-client';

export const SocketContext = React.createContext(undefined);

SocketContext.displayName = 'Socket.IO';
// const __DEV__ = process.env.NODE_ENV === 'development';

export default function SocketProvider (props) {
	const [socket] = useState(io.connect('/', {
		transports: ['websocket'],
		rejectUnauthorized: false,
		secure: process.env.REACT_APP_HTTPS === 'true',
		// path: '/some/url'
	}));
	useEffect(() => {
		socket.on('connect', () => {
			console.log('socket connected');
		});
		socket.on('connect_error', console.error); // TODO
		socket.on('error',         console.error); // TODO
		socket.on('disconnect', reason => {
			if ('io server disconnect' === reason) {
				// the disconnection was initiated by the server, you need to reconnect manually
				socket.connect();
			}
			// else the socket will automatically try to reconnect
		});
		socket.on('reconnect_attempt', attemptNumber => {
			if (attemptNumber > 3) {
				socket.io.opts.transports = ['polling', 'websocket'];
			}
		});
	}, [socket]);

	return (
		<SocketContext.Provider value={socket}>
			{props.children}
		</SocketContext.Provider>
	)
}
