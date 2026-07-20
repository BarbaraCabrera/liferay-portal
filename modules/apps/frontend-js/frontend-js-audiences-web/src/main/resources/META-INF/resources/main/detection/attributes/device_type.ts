/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import UAParser from 'ua-parser-js';

export function getDeviceType(uaParser: UAParser): string {
	const type = uaParser.getDevice().type;

	if (type === 'mobile') {
		return 'mobile';
	}
	else if (type === 'tablet') {
		return 'tablet';
	}

	return 'desktop';
}
