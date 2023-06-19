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

package com.liferay.fragment.web.internal.display.context;

import com.liferay.fragment.constants.FragmentActionKeys;
import com.liferay.fragment.web.internal.constants.FragmentWebKeys;
import com.liferay.fragment.web.internal.item.selector.FragmentCollectionItemSelectorCriterion;
import com.liferay.fragment.web.internal.security.permission.resource.FragmentPermission;
import com.liferay.frontend.taglib.clay.servlet.taglib.util.DropdownItem;
import com.liferay.frontend.taglib.clay.servlet.taglib.util.DropdownItemListBuilder;
import com.liferay.item.selector.ItemSelector;
import com.liferay.item.selector.criteria.UUIDItemSelectorReturnType;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.portlet.LiferayPortletRequest;
import com.liferay.portal.kernel.portlet.LiferayPortletResponse;
import com.liferay.portal.kernel.portlet.RequestBackedPortletURLFactory;
import com.liferay.portal.kernel.portlet.RequestBackedPortletURLFactoryUtil;
import com.liferay.portal.kernel.portlet.url.builder.PortletURLBuilder;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.WebKeys;

import java.util.List;
import java.util.Map;

import javax.portlet.ResourceURL;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Jürgen Kappler
 */
public class InheritedFragmentManagementToolbarDisplayContext
	extends FragmentManagementToolbarDisplayContext {

	public InheritedFragmentManagementToolbarDisplayContext(
		HttpServletRequest httpServletRequest,
		LiferayPortletRequest liferayPortletRequest,
		LiferayPortletResponse liferayPortletResponse,
		FragmentDisplayContext fragmentDisplayContext) {

		super(
			httpServletRequest, liferayPortletRequest, liferayPortletResponse,
			fragmentDisplayContext.getFragmentEntriesSearchContainer(),
			fragmentDisplayContext);

		_itemSelector = (ItemSelector)httpServletRequest.getAttribute(
			FragmentWebKeys.ITEM_SELECTOR);
	}

	@Override
	public List<DropdownItem> getActionDropdownItems() {
		ThemeDisplay themeDisplay =
			(ThemeDisplay)httpServletRequest.getAttribute(
				WebKeys.THEME_DISPLAY);

		return DropdownItemListBuilder.add(
			dropdownItem -> {
				dropdownItem.putData(
					"action", "exportFragmentCompositionsAndFragmentEntries");
				dropdownItem.setIcon("upload");
				dropdownItem.setLabel(
					LanguageUtil.get(httpServletRequest, "export"));
				dropdownItem.setQuickAction(true);
			}
		).add(
			() -> FragmentPermission.contains(
				themeDisplay.getPermissionChecker(),
				themeDisplay.getScopeGroupId(),
				FragmentActionKeys.MANAGE_FRAGMENT_ENTRIES),
			dropdownItem -> {
				dropdownItem.putData("action", "copyToSelectedFragmentEntries");
				dropdownItem.setIcon("copy");
				dropdownItem.setLabel(
					LanguageUtil.get(httpServletRequest, "copy-to"));
				dropdownItem.setQuickAction(true);
			}
		).build();
	}

	@Override
	public Map<String, Object> getComponentContext() throws Exception {
		return HashMapBuilder.<String, Object>put(
			"copyFragmentEntryURL",
			() -> {
				ThemeDisplay themeDisplay =
					(ThemeDisplay)httpServletRequest.getAttribute(
						WebKeys.THEME_DISPLAY);

				return PortletURLBuilder.createActionURL(
					liferayPortletResponse
				).setActionName(
					"/fragment/copy_fragment_entry"
				).setRedirect(
					themeDisplay.getURLCurrent()
				).buildString();
			}
		).put(
			"exportFragmentCompositionsAndFragmentEntriesURL",
			() -> {
				ResourceURL exportFragmentEntriesURL =
					liferayPortletResponse.createResourceURL();

				exportFragmentEntriesURL.setResourceID(
					"/fragment" +
						"/export_fragment_compositions_and_fragment_entries");

				return exportFragmentEntriesURL.toString();
			}
		).put(
			"fragmentCollectionId",
			ParamUtil.getLong(liferayPortletRequest, "fragmentCollectionId")
		).put(
			"selectFragmentCollectionURL",
			() -> {
				FragmentCollectionItemSelectorCriterion
					fragmentCollectionItemSelectorCriterion =
						new FragmentCollectionItemSelectorCriterion();

				fragmentCollectionItemSelectorCriterion.
					setDesiredItemSelectorReturnTypes(
						new UUIDItemSelectorReturnType());

				RequestBackedPortletURLFactory requestBackedPortletURLFactory =
					RequestBackedPortletURLFactoryUtil.create(
						httpServletRequest);

				return String.valueOf(
					_itemSelector.getItemSelectorURL(
						requestBackedPortletURLFactory,
						liferayPortletResponse.getNamespace() +
							"selectFragmentCollection",
						fragmentCollectionItemSelectorCriterion));
			}
		).build();
	}

	private final ItemSelector _itemSelector;

}