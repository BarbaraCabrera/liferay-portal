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

package com.liferay.layout.admin.web.internal.servlet.taglib.util;
import com.liferay.layout.utility.page.model.LayoutUtilityPageEntry;
import com.liferay.layout.utility.page.service.LayoutUtilityPageEntryLocalServiceUtil;
import com.liferay.frontend.taglib.clay.servlet.taglib.util.DropdownItem;
import com.liferay.frontend.taglib.clay.servlet.taglib.util.DropdownItemListBuilder;
import com.liferay.petra.function.UnsafeConsumer;
import com.liferay.petra.string.StringPool;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.portlet.url.builder.PortletURLBuilder;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.kernel.util.WebKeys;

import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Objects;

/**
 * @author Bárbara Cabrera
 */
public class LayoutUtilityPageEntryActionDropdownItemsProvider {

	public LayoutUtilityPageEntryActionDropdownItemsProvider(
		LayoutUtilityPageEntry layoutUtilityPageEntry,
		RenderRequest renderRequest, RenderResponse renderResponse) {

		_httpServletRequest = PortalUtil.getHttpServletRequest(renderRequest);
		_renderResponse = renderResponse;
		_layoutUtilityPageEntry = layoutUtilityPageEntry;

		_themeDisplay = (ThemeDisplay)_httpServletRequest.getAttribute(
			WebKeys.THEME_DISPLAY);

	}

	public List<DropdownItem> getActionDropdownItems() {

		return DropdownItemListBuilder.addGroup(
			dropdownGroupItem -> {
				dropdownGroupItem.setDropdownItems(
					DropdownItemListBuilder.add(
						_getMarkAsDefaultDisplayPageActionUnsafeConsumer()
					).build());
			}).build();
	}

	private UnsafeConsumer<DropdownItem, Exception>
	_getMarkAsDefaultDisplayPageActionUnsafeConsumer() {

		return dropdownItem -> {
			dropdownItem.putData("action", "markAsDefaultDisplayPage");
			dropdownItem.putData(
				"markAsDefaultDisplayPageURL",
				PortletURLBuilder.createActionURL(
					_renderResponse
				).setActionName(
					"/layout_page_template_admin" +
					"/mark_as_default_utility_page_entry"
				).setRedirect(
					_themeDisplay.getURLCurrent()
				).setParameter(
					"isDefaultLayoutUtilityPageEntry",
					!_layoutUtilityPageEntry.isDefaultLayoutUtilityPageEntry()
				).setParameter(
					"layoutUtilityPageEntryId",
					_layoutUtilityPageEntry.getLayoutUtilityPageEntryId()
				).buildString());

			String message = StringPool.BLANK;

			LayoutUtilityPageEntry defaultLayoutUtilityPageEntry =
				LayoutUtilityPageEntryLocalServiceUtil.
					getDefaultLayoutUtilityPageEntry(
						_layoutUtilityPageEntry.getGroupId(),
						_layoutUtilityPageEntry.getType());

			if (defaultLayoutUtilityPageEntry != null) {
				long defaultLayoutUtilityPageEntryId =
					defaultLayoutUtilityPageEntry.
						getLayoutUtilityPageEntryId();
				long layoutUtilityPageEntryId =
					_layoutUtilityPageEntry.getLayoutUtilityPageEntryId();

				if (defaultLayoutUtilityPageEntryId !=
					layoutUtilityPageEntryId) {

					message = LanguageUtil.format(
						_httpServletRequest,
						"do-you-want-to-replace-x-for-x-as-the-default-" +
						"display-page-template",
						new String[] {
							_layoutUtilityPageEntry.getName(),
							defaultLayoutUtilityPageEntry.getName()
						});
				}
			}

			if (Validator.isNull(message) &&
				_layoutUtilityPageEntry.isDefaultLayoutUtilityPageEntry()) {

				message = LanguageUtil.get(
					_httpServletRequest, "unmark-default-confirmation");
			}

			dropdownItem.putData("message", message);

			String label = "mark-as-default";

			if (_layoutUtilityPageEntry.isDefaultLayoutUtilityPageEntry()) {
				label = "unmark-as-default";
			}

			dropdownItem.setLabel(LanguageUtil.get(_httpServletRequest, label));
		};
	}


	private static final Log _log = LogFactoryUtil.getLog(
		LayoutUtilityPageEntryActionDropdownItemsProvider.class);
	private final HttpServletRequest _httpServletRequest;
	private final RenderResponse _renderResponse;
	private final ThemeDisplay _themeDisplay;
	private final LayoutUtilityPageEntry _layoutUtilityPageEntry;

}