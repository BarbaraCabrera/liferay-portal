/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export default function propsTransformer({
	additionalProps: {roleSearchContainer},
	portletNamespace,
	...props
}) {
	return {
		...props,
		onClick() {
			if (roleSearchContainer !== 0) {
				const form = document.getElementById(`${portletNamespace}fm`);

				if (form) {
					submitForm(form);
				}
			}
		},
	};
}
