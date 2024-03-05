/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.layout.page.template.item.selector.web.internal.display.context;

import com.liferay.layout.page.template.model.LayoutPageTemplateCollection;
import com.liferay.layout.page.template.service.LayoutPageTemplateCollectionLocalServiceUtil;
import com.liferay.portal.kernel.bean.BeanParamUtil;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.ParamUtil;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Bárbara Cabrera
 */
public class LayoutPageTemplateCollectionsTreeNodeDisplayContext {

	public LayoutPageTemplateCollectionsTreeNodeDisplayContext(
		HttpServletRequest httpServletRequest, ThemeDisplay themeDisplay) {

		_httpServletRequest = httpServletRequest;
		_themeDisplay = themeDisplay;
	}

	public LayoutPageTemplateCollection getLayoutPageTemplateCollection() {
		if (_layoutPageTemplateCollection != null) {
			return _layoutPageTemplateCollection;
		}

		_layoutPageTemplateCollection =
			LayoutPageTemplateCollectionLocalServiceUtil.
				fetchLayoutPageTemplateCollection(
					ParamUtil.getLong(
						_httpServletRequest, "layoutPageTemplateCollectionId"));

		return _layoutPageTemplateCollection;
	}

	public long getLayoutPageTemplateCollectionId() {
		if (_layoutPageTemplateCollectionId != null) {
			return _layoutPageTemplateCollectionId;
		}

		_layoutPageTemplateCollectionId = BeanParamUtil.getLong(
			getLayoutPageTemplateCollection(), _httpServletRequest,
			"layoutPageTemplateCollectionId", -1);

		return _layoutPageTemplateCollectionId;
	}

	public JSONArray getLayoutPageTemplateCollectionJSONArray() {
		return JSONUtil.put(
			JSONUtil.put(
				"children",
				_getLayoutPageTemplateCollectionJSONArray(
					_themeDisplay.getScopeGroupId(), 0)
			).put(
				"id", 0
			).put(
				"name", LanguageUtil.get(_themeDisplay.getLocale(), "home")
			));
	}

	private JSONArray _getLayoutPageTemplateCollectionJSONArray(
		long groupId, long layoutPageTemplateCollectionId) {

		JSONArray jsonArray = JSONFactoryUtil.createJSONArray();

		List<LayoutPageTemplateCollection> layoutPageTemplateCollections =
			LayoutPageTemplateCollectionLocalServiceUtil.
				getLayoutPageTemplateCollections(
					groupId, layoutPageTemplateCollectionId);

		for (LayoutPageTemplateCollection layoutPageTemplateCollection :
				layoutPageTemplateCollections) {

			JSONObject jsonObject = JSONFactoryUtil.createJSONObject();

			JSONArray childrenJSONArray =
				_getLayoutPageTemplateCollectionJSONArray(
					groupId,
					layoutPageTemplateCollection.
						getLayoutPageTemplateCollectionId());

			if (childrenJSONArray.length() > 0) {
				jsonObject.put("children", childrenJSONArray);
			}

			jsonObject.put(
				"id",
				layoutPageTemplateCollection.getLayoutPageTemplateCollectionId()
			).put(
				"name", layoutPageTemplateCollection.getName()
			);

			long selectedLayoutPageTemplateCollectionId =
				getLayoutPageTemplateCollectionId();

			if (selectedLayoutPageTemplateCollectionId ==
					layoutPageTemplateCollection.
						getLayoutPageTemplateCollectionId()) {

				continue;
			}

			jsonArray.put(jsonObject);
		}

		return jsonArray;
	}

	private final HttpServletRequest _httpServletRequest;
	private LayoutPageTemplateCollection _layoutPageTemplateCollection;
	private Long _layoutPageTemplateCollectionId;
	private final ThemeDisplay _themeDisplay;

}