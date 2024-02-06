/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom/extend-expect';
import {act, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import SaveButtons from '../../src/main/resources/META-INF/resources/js/SaveButtons';

const DEFAULT_PROPS = {
	articleId: null,
	defaultLanguageId: 'en_US',
	displayDate: null,
	editingDefaultValues: false,
	permissionsURL: null,
	portletNamespace: 'portletNamespace',
	publishButtonLabel: 'publish',
	saveButtonLabel: 'save',
	selectedLanguageId: 'en_US',
	timeZone: 'UTC',
	workflowEnabled: false,
};

const renderComponent = (props = DEFAULT_PROPS) => {
	return render(
		<>
			<div className="article-content-content" />
			<form action="action" id={`${props.portletNamespace}fm1`} />
			<SaveButtons {...props} />
		</>
	);
};

describe('SaveButtons', () => {
	beforeEach(() => {
		global.Liferay.component = jest
			.fn()
			.mockReturnValue({getValue: () => 'title'});

		global.fetch = jest.fn().mockReturnValue(
			Promise.resolve({
				html: () => Promise.resolve('<div>holi</div>'),
			})
		);
	});

	it('renders', () => {
		renderComponent({
			...DEFAULT_PROPS,
			saveButtonLabel: 'save article',
		});

		expect(screen.get('save article')).toBeInTheDocument();
	});

	it('open modal', () => {
		renderComponent({
			...DEFAULT_PROPS,
			saveButtonLabel: 'save article',
		});

		jest.useFakeTimers();

		userEvent.click(screen.getByText('save article'));

		act(() => {
			jest.runAllTimers();
		});

		jest.useRealTimers();

		expect(screen.getByText('save articlae')).toBeInTheDocument();
	});
});
