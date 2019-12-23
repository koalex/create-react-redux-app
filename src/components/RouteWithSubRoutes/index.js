import React               from 'react';
import PropTypes           from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect }         from 'react-redux';

const RouteWithSubRoutes = ({ user, ...route }) => {
    return (
        <Route
            location={route.location}
            exact={route.exact || false}
            strict={route.strict || false}
            path={route.path}
            render={props => {
                // pass the sub-routes down to keep nesting
                if (route.private && !user) {
                    return (
                        <Redirect to={{
                                pathname: '/signin',
                                state: { from: props.location }
                            }}
                        />
                    );
                }

                if (!route.component) return null;

                return (
                    <route.component
                        {...props}
                        user={user}
                        routes={route.routes || []}
                    />
                );
            }}
        />
    );
};

RouteWithSubRoutes.propTypes = {
    user: PropTypes.object
};

const mapStateToProps = state => ({user: state?.auth?.user});

export default connect(mapStateToProps)(RouteWithSubRoutes);
