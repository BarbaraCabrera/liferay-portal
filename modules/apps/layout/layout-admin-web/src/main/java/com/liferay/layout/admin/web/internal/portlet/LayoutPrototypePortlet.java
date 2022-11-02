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

package com.liferay.layout.admin.web.internal.portlet;

import com.liferay.item.selector.ItemSelector;
import com.liferay.layout.admin.web.internal.configuration.LayoutUtilityPageAdminWebConfiguration;
import com.liferay.layout.prototype.constants.LayoutPrototypePortletKeys;
import com.liferay.layout.utility.page.constants.LayoutUtilityPageActionKeys;
import com.liferay.portal.configuration.metatype.bnd.util.ConfigurableUtil;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;

import java.io.IOException;

import java.util.Map;

import javax.portlet.Portlet;
import javax.portlet.PortletException;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Modified;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Pavel Savinov
 */
@Component(
	configurationPid = "com.liferay.layout.admin.web.internal.configuration.LayoutUtilityPageAdminWebConfiguration",
	property = {
		"com.liferay.portlet.display-category=category.hidden",
		"javax.portlet.name=" + LayoutPrototypePortletKeys.LAYOUT_PROTOTYPE,
		"javax.portlet.resource-bundle=content.Language",
		"javax.portlet.version=3.0"
	},
	service = Portlet.class
)
public class LayoutPrototypePortlet extends MVCPortlet {

	@Activate
	@Modified
	protected void activate(Map<String, Object> properties) {
		_layoutUtilityPageAdminWebConfiguration =
			ConfigurableUtil.createConfigurable(
				LayoutUtilityPageAdminWebConfiguration.class, properties);
	}

	@Override
	protected void doDispatch(
			RenderRequest renderRequest, RenderResponse renderResponse)
		throws IOException, PortletException {

		renderRequest.setAttribute(
			LayoutUtilityPageAdminWebConfiguration.class.getName(),
			_layoutUtilityPageAdminWebConfiguration);
		renderRequest.setAttribute(
			LayoutUtilityPageActionKeys.ITEM_SELECTOR, _itemSelector);

		super.doDispatch(renderRequest, renderResponse);
	}

	@Reference
	private ItemSelector _itemSelector;

	private volatile LayoutUtilityPageAdminWebConfiguration
		_layoutUtilityPageAdminWebConfiguration;

}