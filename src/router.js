import React               from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route }   from 'react-router-dom';
import RouteWithSubRoutes  from './components/RouteWithSubRoutes';
import routes              from 'modules/routes';
import history             from './middlewares/history';
import NotFound            from './components/404';

export default function Router () {
	return (
		<ConnectedRouter history={history}>
			<Switch>
				{routes.map((route, i) => {
					return (
						<RouteWithSubRoutes
							key={'mainRoute' + i + route.path}
							{...route}
						/>
					)
				})}
				<Route component={NotFound} />
			</Switch>
		</ConnectedRouter>
	);
};
