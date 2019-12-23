import { createStore, compose, applyMiddleware } from 'redux';
import { routerMiddleware }                      from 'connected-react-router';
import createSagaMiddleware                      from 'redux-saga';
import createReducer                             from '../reducer';
import history                                   from '../middlewares/history';
import api                                       from '../middlewares/api';
import fingerprint                               from '../middlewares/fingerprint';
import {
    middlewares as modulesMiddlewares,
    rootSaga
} from 'modules';
const __DEV__ = process.env.NODE_ENV === 'development';

export default function (preloadedState = {}) {
    const rootReducer    = createReducer();
    const sagaMiddleware = createSagaMiddleware();

    const middlewares = [
        sagaMiddleware,
        ...modulesMiddlewares,
        routerMiddleware(history),
        fingerprint,
        api
    ];

    let enhancer = applyMiddleware(...middlewares);

    if (__DEV__) {
        const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
        if ('function' === typeof devToolsExtension) enhancer.push(devToolsExtension());
        const DevTools = require('../DevTools').default;
        enhancer = compose(enhancer, DevTools.instrument()); // this MW should always be connected last !!!
    }

    const store = createStore(
        rootReducer,
        preloadedState,
        enhancer
    );

    sagaMiddleware.run(rootSaga);

    store.asyncReducers = {};
    store.injectReducer = (key, asyncReducer) => {
        store.asyncReducers[key] = asyncReducer;
        store.replaceReducer(createReducer(store.asyncReducers));
    };

    /*if (__DEV__) {
        if (module && module.hot) {
            // Enable Webpack hot module replacement for reducers
            module.hot.accept('../reducer', () => {
                const nextRootReducer = require('../reducer/index').default;
                let data = nextRootReducer();
                store.replaceReducer(data.combinedReducer(history));
            });
        }

        window.store = store;
    }*/

    return store;
}
