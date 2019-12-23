import React from 'react';
import User  from 'modules/newModule/components/User/container';

const routes = [
	{
		path: '/__example__',
		component: User,
		private: false,
		exact: true,
		routes: []
	},
];

export default routes;