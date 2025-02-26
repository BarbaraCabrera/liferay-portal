/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import Card from '@clayui/card';
import ClayIcon from '@clayui/icon';
import React from 'react';

export default function MarketplaceTabItem({item}) {
	const openItem = () => {};

	return (
		<Card
			className="card-interactive card-interactive-primary card-type-template mb-2 template-card-horizontal"
			onClick={openItem}
			tabIndex={0}
			title={`${item.name} ${Liferay.Language.get('details')}`}
		>
			<div className="card-body p-2">
				<Card.Row>
					<div className="autofit-col">
						<span className="sticker sticker-lg">
							<span className="sticker-overlay">
								<img
									alt="image"
									className="card-item-first"
									src={item.urlImage}
								/>
							</span>
						</span>
					</div>

					<div className="autofit-col autofit-col-expand">
						<section className="autofit-section ml-2">
							<div className="card-title">
								<span className="text-truncate-inline">
									<span className="text-dark text-truncate">
										{item.name}
									</span>
								</span>
							</div>

							<div className="card-subtitle">
								<span className="text-truncate-inline">
									<span className="text-truncate">
										{item.catalogName}
									</span>
								</span>
							</div>
						</section>
					</div>

					<div className="autofit-col btn btn-monospaced btn-unstyled">
						<ClayIcon
							className="text-secondary"
							symbol="angle-right"
						/>
					</div>
				</Card.Row>
			</div>
		</Card>
	);
}
