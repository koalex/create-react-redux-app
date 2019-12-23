import CSS         from './notFound.module.css';
import React       from 'react';
import Head        from '../Head';
import NotFoundImg from 'assets/img/404.svg';
import {
	injectIntl,
	defineMessages
} from 'react-intl';

const messages = defineMessages({
	Header: {
		id: 'core.404.NotFound',
		defaultMessage: 'Ресурс не найден'
	},
	HomeLink: {
		id: 'core.404.GoHome',
		defaultMessage: 'на главную страницу'
	}
});

function NotFound ({intl: { formatMessage }, ...props}) { // TODO: log
	const goHome = ev => {
		ev.preventDefault();
		props.history.push({ pathname: '/' });
	};

	const title = formatMessage(messages.Header);
	const headProps = {
		title,
		openGraph: {
			title,
			url: window.location.href
		},
		description: process.env.REACT_APP_DESC
	};

	return (
		<div className={CSS['container']}>
			<Head {...headProps} />
			<h1 className={CSS['notFoundHeader']}>
				{formatMessage(messages.Header)}
			</h1>
			<p className={CSS['statusNums']}>
				<span>4</span>
				<span>0</span>
				<span>4</span>
			</p>
			<img src={NotFoundImg} alt={404} className={CSS['statusImg']} />
			<div className={CSS['homeLinkContainer']}>
				<a className={CSS['homeLink']} href="/" onClick={goHome}>
					{formatMessage(messages.HomeLink)} &rarr;
				</a>
			</div>
		</div>
	)
}

export default injectIntl(NotFound);
