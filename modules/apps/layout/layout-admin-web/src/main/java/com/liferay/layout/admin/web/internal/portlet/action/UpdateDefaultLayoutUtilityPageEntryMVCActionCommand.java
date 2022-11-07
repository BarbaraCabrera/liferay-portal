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

package com.liferay.layout.admin.web.internal.portlet.action;

import com.liferay.layout.admin.constants.LayoutAdminPortletKeys;
import com.liferay.layout.utility.page.constants.LayoutUtilityPageEntryConstants;
import com.liferay.layout.utility.page.model.LayoutUtilityPageEntry;
import com.liferay.layout.utility.page.service.LayoutUtilityPageEntryLocalService;
import com.liferay.portal.kernel.portlet.bridges.mvc.BaseMVCActionCommand;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCActionCommand;
import com.liferay.portal.kernel.util.ParamUtil;

import java.util.Objects;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Bárbara Cabrera
 */
@Component(
	property = {
		"javax.portlet.name=" + LayoutAdminPortletKeys.GROUP_PAGES,
		"mvc.command.name=/layout_admin/update_default_layout_utility_page_entry"
	},
	service = MVCActionCommand.class
)
public class UpdateDefaultLayoutUtilityPageEntryMVCActionCommand
	extends BaseMVCActionCommand {

	@Override
	protected void doProcessAction(
			ActionRequest actionRequest, ActionResponse actionResponse)
		throws Exception {

		long layoutUtilityPageEntryId = ParamUtil.getLong(
			actionRequest, "layoutUtilityPageEntryId");

		LayoutUtilityPageEntry layoutUtilityPageEntry =
			_layoutUtilityPageEntryLocalService.getLayoutUtilityPageEntry(
				layoutUtilityPageEntryId);

		if (layoutUtilityPageEntry.isDefaultLayoutUtilityPageEntry()) {
			layoutUtilityPageEntry.setDefaultLayoutUtilityPageEntry(false);

			_layoutUtilityPageEntryLocalService.updateLayoutUtilityPageEntry(
				layoutUtilityPageEntry);

			sendRedirect(actionRequest, actionResponse);

			return;
		}

		LayoutUtilityPageEntry termsOfUseDefaultLayoutUtilityPageEntry =
			_layoutUtilityPageEntryLocalService.
				fetchDefaultLayoutUtilityPageEntry(
					layoutUtilityPageEntry.getGroupId(),
					LayoutUtilityPageEntryConstants.Type.TERMS_OF_USE.
						getType());

		_checkDefaultLayoutUtilityPageEntry(
			actionRequest, actionResponse, layoutUtilityPageEntry,
			termsOfUseDefaultLayoutUtilityPageEntry,
			LayoutUtilityPageEntryConstants.Type.TERMS_OF_USE.getType());

		LayoutUtilityPageEntry errorDefaultLayoutUtilityPageEntry =
			_layoutUtilityPageEntryLocalService.
				fetchDefaultLayoutUtilityPageEntry(
					layoutUtilityPageEntry.getGroupId(),
					LayoutUtilityPageEntryConstants.Type.ERROR_404.getType());

		_checkDefaultLayoutUtilityPageEntry(
			actionRequest, actionResponse, layoutUtilityPageEntry,
			errorDefaultLayoutUtilityPageEntry,
			LayoutUtilityPageEntryConstants.Type.ERROR_404.getType());
	}

	private void _checkDefaultLayoutUtilityPageEntry(
			ActionRequest actionRequest, ActionResponse actionResponse,
			LayoutUtilityPageEntry layoutUtilityPageEntry,
			LayoutUtilityPageEntry defaultLayoutUtilityPageEntry, int type)
		throws Exception {

		if (Objects.equals(layoutUtilityPageEntry.getType(), type)) {
			if (defaultLayoutUtilityPageEntry == null) {
				layoutUtilityPageEntry.setDefaultLayoutUtilityPageEntry(true);

				_layoutUtilityPageEntryLocalService.
					updateLayoutUtilityPageEntry(layoutUtilityPageEntry);

				sendRedirect(actionRequest, actionResponse);

				return;
			}

			layoutUtilityPageEntry.setDefaultLayoutUtilityPageEntry(true);
			defaultLayoutUtilityPageEntry.setDefaultLayoutUtilityPageEntry(
				false);

			_layoutUtilityPageEntryLocalService.updateLayoutUtilityPageEntry(
				layoutUtilityPageEntry);
			_layoutUtilityPageEntryLocalService.updateLayoutUtilityPageEntry(
				defaultLayoutUtilityPageEntry);

			sendRedirect(actionRequest, actionResponse);
		}
	}

	@Reference
	private LayoutUtilityPageEntryLocalService
		_layoutUtilityPageEntryLocalService;

}