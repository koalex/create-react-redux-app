import React, { useState, useEffect } from 'react';
import PropTypes                      from 'prop-types';
import { connect }                    from 'react-redux';
import { IntlProvider }               from 'react-intl';
import dispatch                       from './dispatch';
import { SET_LOCALES_LIST }           from './i18n/actionTypes';

const initialMessages = {
	ru: require('./i18n/messages/ru.json'),
	en: require('./i18n/messages/en.json')
};

function I18nProvider (props) {
	const [messages/*, setMessages*/] = useState(initialMessages);

	useEffect(() => {
		const locales = Object.keys(messages);
		props.dispatch({type: SET_LOCALES_LIST, data: { locales }});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages]);

	return (
		<IntlProvider locale={props.locale} messages={messages[props.locale]}>
			{props.children}
		</IntlProvider>
	);
}

I18nProvider.propTypes = {
	locale: PropTypes.string.isRequired
};

export default connect(state => ({
	locale: state['i18n'].locale
}), {dispatch})(I18nProvider);
