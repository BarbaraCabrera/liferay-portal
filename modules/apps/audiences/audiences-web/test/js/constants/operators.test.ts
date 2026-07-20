/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {getOperatorLabel} from '../../../src/main/resources/META-INF/resources/js/constants/operators';

describe('getOperatorLabel', () => {
	it('labels the shared operators', () => {
		expect(getOperatorLabel('eq')).toBe('equals');
		expect(getOperatorLabel('not_eq')).toBe('not-equals');
		expect(getOperatorLabel('includes')).toBe('contains');
		expect(getOperatorLabel('not_includes')).toBe('does-not-contain');
	});

	it('labels the relational operators without the "is" prefix', () => {
		expect(getOperatorLabel('gt')).toBe('greater-than');
		expect(getOperatorLabel('gte')).toBe('greater-than-or-equals');
		expect(getOperatorLabel('lt')).toBe('less-than');
		expect(getOperatorLabel('lte')).toBe('less-than-or-equals');
	});

	it('labels segment membership operators', () => {
		expect(getOperatorLabel('includes', 'segments')).toBe('belongs-to');
		expect(getOperatorLabel('not_includes', 'segments')).toBe(
			'does-not-belong-to'
		);
	});

	it('falls back to the operator name when unknown', () => {
		expect(getOperatorLabel('unknown')).toBe('unknown');
	});
});
