/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import UAParser from 'ua-parser-js';

import {getDeviceType} from '../src/main/resources/META-INF/resources/main/detection/attributes/device_type';

const USER_AGENTS: {expected: string; label: string; userAgent: string}[] = [
	{
		expected: 'mobile',
		label: 'iPhone (Safari, iOS 17)',
		userAgent:
			'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
	},
	{
		expected: 'mobile',
		label: 'Android phone (Chrome, Pixel 8)',
		userAgent:
			'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
	},
	{
		expected: 'tablet',
		label: 'Android tablet (Chrome, Galaxy Tab S9)',
		userAgent:
			'Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
	},
	{
		expected: 'tablet',
		label: 'iPad (Safari, legacy iPadOS 12 UA)',
		userAgent:
			'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1 Mobile/15E148 Safari/604.1',
	},
	{

		// Since iPadOS 13, Safari on iPad sends a Macintosh desktop-class user
		// agent by default, so it is indistinguishable from a real Mac and
		// classifies as 'desktop'.

		expected: 'desktop',
		label: 'iPad (Safari, iPadOS 17 desktop-class UA)',
		userAgent:
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
	},
	{
		expected: 'desktop',
		label: 'Windows desktop (Chrome)',
		userAgent:
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
	},
	{
		expected: 'desktop',
		label: 'macOS desktop (Firefox)',
		userAgent:
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:127.0) Gecko/20100101 Firefox/127.0',
	},
];

describe('attribute device_type', () => {
	it.each(USER_AGENTS)(
		'classifies $label as $expected',
		({expected, userAgent}) => {
			expect(getDeviceType(new UAParser(userAgent))).toBe(expected);
		}
	);
});
