/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import {
	MarketplaceRest,
	useMarketplaceConfiguration,
} from '@liferay/marketplace-js-components-web';

import MarketplaceSearchResults from '../../../../../src/main/resources/META-INF/resources/page_editor/plugins/fragments_and_widgets/components/MarketplaceSearchResults';

global.Liferay = {
	FeatureFlags: {'LPD-34938': true},
	Language: {get: (key) => key},
};

jest.mock('@liferay/marketplace-js-components-web', () => {
	const actual = jest.requireActual('@liferay/marketplace-js-components-web');
	const mockGetProducts = {
		getProducts: jest.fn(),
	};
	const mockMarketplaceRest = jest.fn(() => mockGetProducts);
	mockMarketplaceRest.getBaseResourceURL = jest.fn(() => 'mocked-base-url');

	return {
		...actual,
		MarketplaceContext: {
			Provider: ({children, value}) => (
				<actual.MarketplaceContext.Provider value={value}>
					{children}
				</actual.MarketplaceContext.Provider>
			),
		},
		MarketplaceRest: mockMarketplaceRest,
		MarketplaceView: {
			STOREFRONT: 'STOREFRONT',
		},
		useMarketplaceConfiguration: jest.fn(),
	};
});

jest.mock('@liferay/layout-js-components-web', () => {
	const {MarketplaceContext} = jest.requireActual(
		'@liferay/marketplace-js-components-web'
	);

	return {
		...jest.requireActual('@liferay/layout-js-components-web'),
		MarketplaceModal: ({onOpenChange, trigger}) => (
			<MarketplaceContext.Provider
				value={{
					modal: {onOpenChange},
					setProduct: jest.fn(),
					setView: jest.fn(),
				}}
			>
				{trigger}
			</MarketplaceContext.Provider>
		),
	};
});

const mockMarketplaceConfiguration = {
	authorized: true,
	data: {},
	loading: false,
};

const mockProducts = {
	items: [
		{
			catalogName: 'Catalog 1',
			name: 'Product 1',
			urlImage: 'urlImage1',
		},
		{
			catalogName: 'Catalog 2',
			name: 'Product 2',
			urlImage: 'urlImage2',
		},
	],
	lastPage: 1,
	page: 1,
};

function renderMarketplaceSearchResults() {
	return render(<MarketplaceSearchResults searchValue="test" />);
}

describe('MarketplaceSearchResults', () => {
	let mockMarketplaceInstance;

	beforeEach(() => {
		useMarketplaceConfiguration.mockReturnValue(
			mockMarketplaceConfiguration
		);
		mockMarketplaceInstance = new MarketplaceRest();
		mockMarketplaceInstance.getProducts.mockResolvedValue(mockProducts);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('renders "see marketplace results" button when not showing results', () => {
		renderMarketplaceSearchResults();

		expect(
			screen.getByRole('button', {name: 'see-marketplace-results'})
		).toBeInTheDocument();
	});

	it('fetches and displays marketplace results when button is clicked', async () => {
		const {container} = renderMarketplaceSearchResults();

		fireEvent.click(
			screen.getByRole('button', {name: 'see-marketplace-results'})
		);

		await waitFor(() => {
			expect(mockMarketplaceInstance.getProducts).toHaveBeenCalled();
			expect(
				screen.getByText('showing-results-from-marketplace')
			).toBeInTheDocument();

			const expectProduct = (index) => {
				expect(
					screen.getByTitle(`Product ${index} details`)
				).toBeInTheDocument();
				expect(
					screen.getByText(`Product ${index}`)
				).toBeInTheDocument();
				expect(
					screen.getByText(`Catalog ${index}`)
				).toBeInTheDocument();
				const imageElements = screen.getAllByRole('img');
				const urlImage = imageElements.find(
					(image) => image.getAttribute('src') === `urlImage${index}`
				);
				expect(urlImage).toBeInTheDocument();
			};

			expectProduct(1);
			expectProduct(2);

			expect(
				container.getElementsByClassName('lexicon-icon-angle-right')
					.length
			).toBe(2);
		});
	});

	it('displays empty state when no results are found', async () => {
		const emptyProducts = {items: [], lastPage: 1, page: 1};
		mockMarketplaceInstance.getProducts.mockResolvedValueOnce(
			emptyProducts
		);

		renderMarketplaceSearchResults({});

		fireEvent.click(
			screen.getByRole('button', {name: 'see-marketplace-results'})
		);

		await waitFor(() => {
			expect(screen.getByText('no-results-found')).toBeInTheDocument();
		});
	});

	it('displays loading indicator while fetching results', async () => {
		mockMarketplaceConfiguration.loading = true;

		const {container} = renderMarketplaceSearchResults();

		fireEvent.click(
			screen.getByRole('button', {name: 'see-marketplace-results'})
		);

		await waitFor(() => {
			expect(
				container.getElementsByClassName('loading-animation').length
			).toBe(1);
		});
	});

	it('handles "load more results" functionality', async () => {
		mockProducts.lastPage = 2;

		renderMarketplaceSearchResults();

		fireEvent.click(
			screen.getByRole('button', {name: 'see-marketplace-results'})
		);

		await waitFor(() => {
			fireEvent.click(
				screen.getByRole('button', {name: 'load-more-results'})
			);
			expect(mockMarketplaceInstance.getProducts).toHaveBeenCalledTimes(
				2
			);
		});
	});

	it('does not render if Liferay FeatureFlag is false', () => {
		global.Liferay.FeatureFlags['LPD-34938'] = false;

		const {container} = renderMarketplaceSearchResults();

		expect(container.firstChild).toBeNull();

		global.Liferay.FeatureFlags['LPD-34938'] = true;
	});

	it('does not render if not authorized', () => {
		mockMarketplaceConfiguration.authorized = false;

		const {container} = renderMarketplaceSearchResults();

		expect(container.firstChild).toBeNull();

		mockMarketplaceConfiguration.authorized = true;
	});
});
