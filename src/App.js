import React                 from 'react';
import { Provider}           from 'react-redux';
import { UserAgentProvider } from '@quentin-sommer/react-useragent';
import IntlProvider          from './i18nProvider';
import SocketProvider        from './socketProvider';
import NoJs                  from './components/NoJs';
import OutdatedBrowser       from './components/OutdatedBrowser';
import Router                from './router';
import createStore 		     from './store';

document.querySelectorAll('meta[name="apple-mobile-web-app-title"],meta[name="application-name"]')
    .forEach(node => node.remove());

let DevTools = () => null;
if (process.env.NODE_ENV === 'development') {
  DevTools = require('./DevTools.jsx').default;
}

const store = createStore(/*preloadedState*/);
const outdatedBrowsers = {
    IE: [7,8,9,10,11],
};

function RenderOutdatedBrowsers (/*props*/) {
    return Object.keys(outdatedBrowsers).reduce((acc, browser) => {
        if (Array.isArray(outdatedBrowsers[browser])) {
            for (let version of outdatedBrowsers[browser]) {
                acc.push(<OutdatedBrowser key={'outdated' + browser + version} browser={browser} version={version} />);
            }
        } else {
            acc.push(<OutdatedBrowser key={'outdated' + outdatedBrowsers[browser]}
                                      browser={browser}
                                      version={outdatedBrowsers[browser]}
            />);
        }
        return acc;
    }, []);
}

function App (/*props*/) {
    return (
        <Provider store={store}>
            <SocketProvider>
                <UserAgentProvider ua={window.navigator.userAgent}>
                    <IntlProvider>
                        <>
                            <RenderOutdatedBrowsers />
                            <NoJs />
                            <Router />
                            <DevTools />
                        </>
                    </IntlProvider>
                </UserAgentProvider>
            </SocketProvider>
        </Provider>
    );
}

export default App;
