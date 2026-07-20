/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Group, SerializedGroup} from '../../types';
import {isGroup} from './isGroup';

export function serializeGroup(
	group: Group,
	numberAttributes: Set<string> = new Set()
): SerializedGroup {
	return {
		conjunction: group.conjunction,
		rules: group.items.map((node) =>
			isGroup(node)
				? serializeGroup(node, numberAttributes)
				: {
						attribute: node.attribute,
						operator: node.operator,
						value:
							numberAttributes.has(node.attribute) &&
							node.value !== ''
								? Number(node.value)
								: node.value,
					}
		),
	};
}
