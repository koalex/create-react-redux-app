import CSS   from './NoJs.module.css';
import React from 'react';
import {
	injectIntl,
	defineMessages
} from 'react-intl';

const messages = defineMessages({
	InYourBrowser: {
		id: 'core.NoJs.IN_YOUR_BROWSER',
		defaultMessage: 'В вашем браузере отключен JavaScript'
	},
	ForWatching: {
		id: 'core.NoJs.FOR_WATCHING',
		defaultMessage: 'Для просмотра данного сайта'
	},
	How: {
		id: 'core.NoJs.HOW',
		defaultMessage: 'Как включить JavaScript ?'
	},
	On: {
		id: 'core.NoJs.ON',
		defaultMessage: 'включите'
	}
});

function NoJs ({intl}) {
	const { formatMessage, locale } = intl;

	return (
			<noscript dangerouslySetInnerHTML={{
					__html: (`<div class="${CSS['no-js']}">
						<p>
							<br/>${formatMessage(messages.InYourBrowser)}<br/><br/>
							${formatMessage(messages.ForWatching)}
							&nbsp;
							<a href="https://enable-javascript.com/${locale}/" title="${formatMessage(messages.How)}" target="_blank">
								${formatMessage(messages.On)}
							</a>&nbsp;JavaScript
						</p>
					</div>`).replace(/\t{0,}/g, '')
				}}
			/>

	);
}

export default injectIntl(NoJs);
