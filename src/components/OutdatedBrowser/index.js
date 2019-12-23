import CSS                            from './OutdatedBrowser.module.css';
import React, { useContext }          from 'react';
import { UAContext }                  from '@quentin-sommer/react-useragent';
import { injectIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
	Header: {
		id: 'core.OutdatedBrowser.HEADER',
		defaultMessage: 'Ваш браузер не поддерживается'
	},
	Download: {
		id: 'core.OutdatedBrowser.DOWNLOAD',
		defaultMessage: 'скачать'
	},
	Available: {
		id: 'core.OutdatedBrowser.AVAILABLE',
		defaultMessage: 'доступно для'
	}
});

function OutdatedBrowser (props) {
	const { intl, browser, version }   = props;
	const { parser }                   = useContext(UAContext);
	const { name, version: _v, major } = parser.getBrowser();
	if (browser !== name) return null;
	if (!(version && (version.toString() === _v.toString() || version.toString() === major.toString()))) return null;

	return (
		<table className={`${CSS['outdatedbrowser']} ${CSS['table']}`}>
			<tbody>
				<tr>
					<td className={CSS['outdatedbrowser__header']} colSpan="3">
						<h1>{intl.formatMessage(messages.Header)}</h1>
					</td>
				</tr>
				<tr>
					<td className={CSS['chrome']}><i className={CSS['browser-img']} />
						<h2 className={CSS['browser-name']}>GOOGLE CHROME</h2><a rel="noopener noreferrer" className={CSS['download']}
						                                                  href="https://www.google.com/chrome/browser/desktop"
						                                                  target="_blank">{intl.formatMessage(messages.Download)}</a>
						<div className={CSS['under']}>
							<p>{intl.formatMessage(messages.Available)}</p>
							<div className={CSS['under-overlay']} />
							<ul className={CSS['systems-list']}>
								<li className={CSS['systems-list-item']}><i className={CSS['windows']} title="WINDOWS" /></li>
								<li className={CSS['systems-list-item']}><i className={CSS['apple']} title="MAC OS" /></li>
								<li className={CSS['systems-list-item']}><i className={CSS['linux']} title="LINUX" /></li>
							</ul>
						</div>
					</td>
					<td className={CSS['firefox']}><i className={CSS['browser-img']} />
						<h2 className={CSS['browser-name']}>MOZILLA FIREFOX</h2><a rel="noopener noreferrer" className={CSS['download']}
						                                                    href="http://www.mozilla.org/firefox/new"
						                                                    target="_blank">{intl.formatMessage(messages.Download)}</a>
						<div className={CSS['under']}>
							<p>{intl.formatMessage(messages.Available)}</p>
							<div className={CSS['under-overlay']} />
							<ul className={CSS['systems-list']}>
								<li className={CSS['systems-list-item']}><i className={CSS['windows']} title="WINDOWS" /></li>
								<li className={CSS['systems-list-item']}><i className={CSS['apple']} title="MAC OS" /></li>
								<li className={CSS['systems-list-item']}><i className={CSS['linux']} title="LINUX" /></li>
							</ul>
						</div>
					</td>
					<td className={CSS['edge']}><i className={CSS['browser-img']} />
						<h2 className={CSS['browser-name']}>MICROSOFT EDGE</h2><a rel="noopener noreferrer"
							className={CSS['download']} href="https://support.microsoft.com/help/4027741/windows-get-microsoft-edge"
							target="_blank">{intl.formatMessage(messages.Download)}</a>
						<div className={CSS['under']}>
							<p>{intl.formatMessage(messages.Available)}</p>
							<div className={CSS['under-overlay']} />
							<ul className={CSS['systems-list']}>
								<li className={CSS['systems-list-item']}><i className={CSS['windows']} title="WINDOWS &gt;= 10" /></li>
							</ul>
						</div>
					</td>
				</tr>
				<tr>
					<td className={CSS['safari']}><i className={CSS['browser-img']} />
						<h2 className={CSS['browser-name']}>APPLE SAFARI</h2><a rel="noopener noreferrer" className={CSS['download']}
						                                                 href="https://support.apple.com/downloads/safari"
						                                                 target="_blank">{intl.formatMessage(messages.Download)}</a>
						<div className={CSS['under']}>
							<p>{intl.formatMessage(messages.Available)}</p>
							<div className={CSS['under-overlay']} />
							<ul className={CSS['systems-list']}>
								<li className={CSS['systems-list-item']}><i className={CSS['apple']} title="MAC OS" /></li>
							</ul>
						</div>
					</td>
					<td className={CSS['yandex']}><i className={CSS['browser-img']} />
						<h2 className={CSS['browser-name']}>YANDEX BROWSER</h2><a rel="noopener noreferrer" className={CSS['download']}
						                                                   href="https://browser.yandex.ru/desktop/main"
						                                                   target="_blank">{intl.formatMessage(messages.Download)}</a>
						<div className={CSS['under']}>
							<p>{intl.formatMessage(messages.Available)}</p>
							<div className={CSS['under-overlay']} />
							<ul className={CSS['systems-list']}>
								<li className={CSS['systems-list-item']}><i className={CSS['windows']} title="WINDOWS" /></li>
								<li className={CSS['systems-list-item']}><i className={CSS['apple']} title="MAC OS" /></li>
								<li className={CSS['systems-list-item']}><i className={CSS['linux']} title="LINUX" /></li>
							</ul>
						</div>
					</td>
					<td className={CSS['opera']}><i className={CSS['browser-img']} />
						<h2 className={CSS['browser-name']}>OPERA</h2><a rel="noopener noreferrer" className={CSS['download']} href="http://www.opera.com"
						                                          target="_blank">{intl.formatMessage(messages.Download)}</a>
						<div className={CSS['under']}>
							<p>{intl.formatMessage(messages.Available)}</p>
							<div className={CSS['under-overlay']} />
							<ul className={CSS['systems-list']}>
								<li className={CSS['systems-list-item']}><i className={CSS['windows']} title="WINDOWS" /></li>
								<li className={CSS['systems-list-item']}><i className={CSS['apple']} title="MAC OS" /></li>
								<li className={CSS['systems-list-item']}><i className={CSS['linux']} title="LINUX" /></li>
							</ul>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
	);
}

export default injectIntl(OutdatedBrowser);
