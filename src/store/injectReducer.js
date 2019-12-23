import React                from 'react';
import PropTypes            from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import createReducer        from '../reducer';

export default function (key, reducer) {
	return function (WrappedComponent) {
		class ReducerInjector extends React.Component {
			static WrappedComponent = WrappedComponent;
			static displayName      = `withReducer(${(WrappedComponent.displayName || WrappedComponent.name || 'Component')})`;
			static contextTypes     = {
				store: PropTypes.object.isRequired,
			};

			componentDidMount() {
			// componentWillMount() {
				let store = this.context.store;
				store.asyncReducers[key] = null; // null - isLoading

				if (key in store.asyncReducers) return;

				if (reducer.then && 'function' === typeof reducer.then) {
					reducer.then(_reducer => {
						store.asyncReducers[key] = (_reducer.default ? _reducer.default : _reducer);
						store.replaceReducer(createReducer(store.asyncReducers).reducers);
					});
				} else {
					store.asyncReducers[key] = (reducer.default ? reducer.default : reducer);
					store.replaceReducer(createReducer(store.asyncReducers).reducers);
				}
			}

			render () {
				if (!(key in this.context.store.asyncReducers)) return null;

				return <WrappedComponent {...this.props} />;
			}
		}

		return hoistNonReactStatics(ReducerInjector, WrappedComponent);
	}
}
