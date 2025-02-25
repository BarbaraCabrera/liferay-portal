/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayEmptyState from '@clayui/empty-state';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {
	MarketplaceRest,
	useMarketplaceConfiguration,
} from '@liferay/marketplace-js-components-web';
import PropTypes from 'prop-types';
import React, {useEffect, useMemo, useState} from 'react';

import MarketplaceTabItem from './MarketplaceTabItem';

const productSearchParamsDefault = {
	filter: "(categoryNames/any(x:(x eq 'Fragments')))",
	page: 1,
	pageSize: 20,
	search: '',
	sortDirection: 'asc',
	sortKey: 'createDate',
};

export default function MarketplaceSearchResults({searchValue}) {
	const [results, setResults] = useState({});
	const [productSearchParams, setProductSearchParams] = useState({
		...productSearchParamsDefault,
		search: searchValue,
	});
	const baseResourceURL = MarketplaceRest.getBaseResourceURL();
	const marketplaceConfiguration =
		useMarketplaceConfiguration(baseResourceURL);
	const [loading, setLoading] = useState(marketplaceConfiguration.loading);
	const marketplaceRest = useMemo(() => {
		return new MarketplaceRest(
			baseResourceURL,
			marketplaceConfiguration.data
		);
	}, [baseResourceURL, marketplaceConfiguration.data]);

	useEffect(() => {
		if (!marketplaceConfiguration.authorized) {
			return;
		}

		setLoading(true);

		const urlSearchParams = new URLSearchParams({
			'accountId': '-1',
			'attachments.accountId': '-1',
			'filter': productSearchParams.filter,
			'images.accountId': '-1',
			'nestedFields': 'productSpecifications,skus,categories,images',
			'page': String(productSearchParams.page),
			'pageSize': String(productSearchParams.pageSize),
			'search': productSearchParams.search,
			'skus.accountId': '-1',
			...(productSearchParams.sortKey && {
				sort: `${productSearchParams.sortKey}:${productSearchParams.sortDirection}`,
			}),
		});

		marketplaceRest
			.getProducts(urlSearchParams)
			.then(setResults)
			.catch((error) => console.error('Failed to fetch products:', error))
			.finally(() => setLoading(false));
	}, [
		marketplaceConfiguration.authorized,
		marketplaceRest,
		productSearchParams.page,
		productSearchParams.pageSize,
		productSearchParams.filter,
		productSearchParams.search,
		productSearchParams.sortKey,
		productSearchParams.sortDirection,
	]);

	const title = (
		<div className="p-3 page-editor__marketplace-results__title text-3 text-secondary">
			{Liferay.Language.get('showing-results-from-marketplace')}
		</div>
	);

	if (loading) {
		return (
			<>
				{title} <ClayLoadingIndicator className="mt-3" size="sm" />
			</>
		);
	}

	return (
		<>
			{title}

			{results.items?.length ? (
				<div className="px-3">
					{results.items.map((item, index) => (
						<MarketplaceTabItem item={item} key={index} />
					))}
				</div>
			) : (
				<ClayEmptyState
					description={Liferay.Language.get(
						'try-again-with-a-different-search'
					)}
					imgSrc={`${themeDisplay.getPathThemeImages()}/states/search_state.svg`}
					small
					title={Liferay.Language.get('no-results-found')}
				/>
			)}
		</>
	);
}

MarketplaceSearchResults.proptypes = {
	searchValue: PropTypes.string.isRequired,
};
