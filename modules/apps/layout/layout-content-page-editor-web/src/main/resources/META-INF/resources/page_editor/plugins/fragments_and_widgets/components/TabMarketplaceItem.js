/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayCardWithNavigation} from "@clayui/card";
import ClayIcon from "@clayui/icon";
import React from 'react';

export default function TabMarketplaceItem({item}) {
	return (
		<ClayCardWithNavigation
			className="align-items-center"
			description={item.description}
			horizontal
			horizontalSymbol={item.icon ? (item.icon) : ("marketplace")}
			title={item.title}
		>
			<ClayIcon
				className="text-secondary"
				displayType="unstyled"
				size="sm"
				symbol="angle-right"
			/>
		</ClayCardWithNavigation>
	);
}
