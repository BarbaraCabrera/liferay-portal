/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayEmptyState from '@clayui/empty-state';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import {MarketplaceModal} from '@liferay/layout-js-components-web';
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
	const baseResourceURL = MarketplaceRest.getBaseResourceURL();
	const marketplaceConfiguration =
		useMarketplaceConfiguration(baseResourceURL);
	const authorized = marketplaceConfiguration.authorized;
	const [loading, setLoading] = useState(marketplaceConfiguration.loading);
	const marketplaceRest = useMemo(() => {
		return new MarketplaceRest(
			baseResourceURL,
			marketplaceConfiguration.data
		);
	}, [baseResourceURL, marketplaceConfiguration.data]);
	const [productSearchParams, setProductSearchParams] = useState({
		...productSearchParamsDefault,
		search: searchValue,
	});
	const [results, setResults] = useState({});
	const showMoreResults = results.lastPage > productSearchParams.page;
	const [seeMarketPlaceResults, setSeeMarketPlaceResults] = useState(false);

	useEffect(() => {
		setSeeMarketPlaceResults(false);
		setResults({});
	}, [searchValue, setSeeMarketPlaceResults]);

	useEffect(() => {
		if (!authorized || !seeMarketPlaceResults) {
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
			.then((nextResults) => {
				setResults((prevResults) => {
					if (prevResults.items) {
						nextResults.items = prevResults.items.concat(
							nextResults.items
						);
					}

					return nextResults;
				});
				setLoading(false);
			})
			.catch((error) => console.error('Failed to fetch products:', error))
			.finally(() => setLoading(false));
	}, [
		seeMarketPlaceResults,
		authorized,
		marketplaceRest,
		productSearchParams.page,
		productSearchParams.pageSize,
		productSearchParams.filter,
		productSearchParams.search,
		productSearchParams.sortKey,
		productSearchParams.sortDirection,
	]);

	return Liferay.FeatureFlags['LPD-34938'] && authorized ? (
		<div className="page-editor__fragments-widgets__search-results-panel__see-marketplace-results">
			{seeMarketPlaceResults ? (
				<div>
					<div className="p-3 page-editor__marketplace-results__title text-3 text-secondary">
						{Liferay.Language.get(
							'showing-results-from-marketplace'
						)}
					</div>

					{results.items?.length ? (
						<div className="px-3">
							{results.items.map((item, index) => (
								<MarketplaceModal
									key={index}
									trigger={<MarketplaceTabItem item={item} />}
								/>
							))}
						</div>
					) : (
						!loading && (
							<ClayEmptyState
								description={Liferay.Language.get(
									'try-again-with-a-different-search'
								)}
								imgSrc={`${themeDisplay.getPathThemeImages()}/states/search_state.svg`}
								small
								title={Liferay.Language.get('no-results-found')}
							/>
						)
					)}

					{loading && (
						<ClayLoadingIndicator className="mt-3" size="sm" />
					)}

					{showMoreResults && (
						<ClayButton
							aria-label={Liferay.Language.get(
								'load-more-results'
							)}
							className="p-3 text-secondary"
							displayType="link"
							onClick={() => {
								setProductSearchParams(
									(prevProductSearchParams) => ({
										...prevProductSearchParams,
										page: prevProductSearchParams.page + 1,
									})
								);
							}}
							size="sm"
						>
							{Liferay.Language.get('load-more-results')}
						</ClayButton>
					)}
				</div>
			) : (
				<ClayButton
					aria-label={Liferay.Language.get('see-marketplace-results')}
					className="p-3"
					displayType="link"
					onClick={() => {
						setSeeMarketPlaceResults(true);
					}}
					size="sm"
				>
					{Liferay.Language.get('see-marketplace-results')}
				</ClayButton>
			)}
		</div>
	) : null;
}

MarketplaceSearchResults.proptypes = {
	searchValue: PropTypes.string.isRequired,
};
