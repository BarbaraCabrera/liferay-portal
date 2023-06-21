/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.fragment.web.internal.item.selector;

import com.liferay.fragment.constants.FragmentPortletKeys;
import com.liferay.fragment.model.FragmentCollection;
import com.liferay.fragment.service.FragmentCollectionServiceUtil;
import com.liferay.fragment.web.internal.util.FragmentPortletUtil;
import com.liferay.item.selector.ItemSelectorReturnType;
import com.liferay.item.selector.ItemSelectorViewDescriptor;
import com.liferay.item.selector.criteria.UUIDItemSelectorReturnType;
import com.liferay.portal.kernel.dao.search.EmptyOnClickRowChecker;
import com.liferay.portal.kernel.dao.search.SearchContainer;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.CompanyConstants;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.portlet.SearchOrderByUtil;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.ArrayUtil;
import com.liferay.portal.kernel.util.JavaConstants;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.util.PortalInstances;

import javax.portlet.PortletURL;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Barbara Cabrera
 */
public class FragmentCollectionItemSelectorViewDescriptor
	implements ItemSelectorViewDescriptor<FragmentCollection> {

	public FragmentCollectionItemSelectorViewDescriptor(
		FragmentCollectionItemSelectorCriterion
			fragmentCollectionItemSelectorCriterion,
		HttpServletRequest httpServletRequest, PortletURL portletURL) {

		_fragmentCollectionItemSelectorCriterion =
			fragmentCollectionItemSelectorCriterion;
		_httpServletRequest = httpServletRequest;
		_portletURL = portletURL;

		_renderRequest = (RenderRequest)httpServletRequest.getAttribute(
			JavaConstants.JAVAX_PORTLET_REQUEST);
		_renderResponse = (RenderResponse)httpServletRequest.getAttribute(
			JavaConstants.JAVAX_PORTLET_RESPONSE);
	}

	@Override
	public String getDefaultDisplayStyle() {
		return "icon";
	}

	public String[] getDisplayViews() {
		return new String[] {"icon"};
	}

	@Override
	public ItemDescriptor getItemDescriptor(
		FragmentCollection fragmentCollection) {

		return new FragmentCollectionItemDescriptor(fragmentCollection);
	}

	@Override
	public ItemSelectorReturnType getItemSelectorReturnType() {
		return new UUIDItemSelectorReturnType();
	}

	public String getOrderByType() {
		if (Validator.isNotNull(_orderByType)) {
			return _orderByType;
		}

		_orderByType = SearchOrderByUtil.getOrderByType(
			_httpServletRequest, FragmentPortletKeys.FRAGMENT,
			"fragment-collections-order-by-type", "asc");

		return _orderByType;
	}

	@Override
	public SearchContainer<FragmentCollection> getSearchContainer()
		throws PortalException {

		if (_searchContainer != null) {
			return _searchContainer;
		}

		ThemeDisplay themeDisplay =
			(ThemeDisplay)_httpServletRequest.getAttribute(
				WebKeys.THEME_DISPLAY);

		SearchContainer<FragmentCollection> searchContainer =
			new SearchContainer(
				_renderRequest, _portletURL, null,
				"there-are-no-fragment-sets");

		searchContainer.setOrderByCol(_getOrderByCol());
		searchContainer.setOrderByComparator(
			FragmentPortletUtil.getFragmentCollectionOrderByComparator(
				_getOrderByCol(), getOrderByType()));
		searchContainer.setOrderByType(getOrderByType());

		long[] groupIds = {themeDisplay.getScopeGroupId()};

		if (_fragmentCollectionItemSelectorCriterion.
				getIsIncludeGlobalFragmentCollections()) {

			groupIds = new long[] {
				themeDisplay.getScopeGroupId(), themeDisplay.getCompanyGroupId()
			};
		}

		Group scopeGroup = themeDisplay.getScopeGroup();

		if ((themeDisplay.getCompanyId() ==
				PortalInstances.getDefaultCompanyId()) &&
			scopeGroup.isCompany()) {

			groupIds = ArrayUtil.append(groupIds, CompanyConstants.SYSTEM);
		}

		long[] allGroupIds = groupIds;

		if (_isSearch()) {
			searchContainer.setResultsAndTotal(
				() -> FragmentCollectionServiceUtil.getFragmentCollections(
					allGroupIds, _getKeywords(), searchContainer.getStart(),
					searchContainer.getEnd(),
					searchContainer.getOrderByComparator()),
				FragmentCollectionServiceUtil.getFragmentCollectionsCount(
					allGroupIds, _getKeywords()));
		}
		else {
			searchContainer.setResultsAndTotal(
				() -> FragmentCollectionServiceUtil.getFragmentCollections(
					allGroupIds, searchContainer.getStart(),
					searchContainer.getEnd(),
					searchContainer.getOrderByComparator()),
				FragmentCollectionServiceUtil.getFragmentCollectionsCount(
					allGroupIds));
		}

		searchContainer.setRowChecker(
			new EmptyOnClickRowChecker(_renderResponse));

		_searchContainer = searchContainer;

		return _searchContainer;
	}

	@Override
	public boolean isShowBreadcrumb() {
		return false;
	}

	@Override
	public boolean isShowSearch() {
		return true;
	}

	private String _getKeywords() {
		if (_keywords != null) {
			return _keywords;
		}

		_keywords = ParamUtil.getString(_httpServletRequest, "keywords");

		return _keywords;
	}

	private String _getOrderByCol() {
		if (Validator.isNotNull(_orderByCol)) {
			return _orderByCol;
		}

		_orderByCol = SearchOrderByUtil.getOrderByCol(
			_httpServletRequest, FragmentPortletKeys.FRAGMENT,
			"fragment-collections-order-by-col", "create-date");

		return _orderByCol;
	}

	private boolean _isSearch() {
		if (Validator.isNotNull(_getKeywords())) {
			return true;
		}

		return false;
	}

	private final FragmentCollectionItemSelectorCriterion
		_fragmentCollectionItemSelectorCriterion;
	private final HttpServletRequest _httpServletRequest;
	private String _keywords;
	private String _orderByCol;
	private String _orderByType;
	private final PortletURL _portletURL;
	private final RenderRequest _renderRequest;
	private final RenderResponse _renderResponse;
	private SearchContainer<FragmentCollection> _searchContainer;

}