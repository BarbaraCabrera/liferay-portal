<%--
/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
--%>

<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%@ taglib uri="http://java.sun.com/portlet_2_0" prefix="portlet" %>

<%@ taglib uri="http://liferay.com/tld/aui" prefix="aui" %><%@
taglib uri="http://liferay.com/tld/clay" prefix="clay" %><%@
taglib uri="http://liferay.com/tld/frontend" prefix="liferay-frontend" %><%@
taglib uri="http://liferay.com/tld/theme" prefix="liferay-theme" %><%@
taglib uri="http://liferay.com/tld/ui" prefix="liferay-ui" %>

<%@ page import="com.liferay.petra.string.StringPool" %><%@
page import="com.liferay.portal.kernel.dao.search.SearchContainer" %><%@
page import="com.liferay.portal.kernel.language.LanguageUtil" %><%@
page import="com.liferay.portal.kernel.model.Resource" %><%@
page import="com.liferay.portal.kernel.model.Role" %><%@
page import="com.liferay.portal.kernel.model.role.RoleConstants" %><%@
page import="com.liferay.portal.kernel.security.permission.ActionKeys" %><%@
page import="com.liferay.portal.kernel.security.permission.ResourceActionsUtil" %><%@
page import="com.liferay.portal.kernel.util.FriendlyURLNormalizerUtil" %><%@
page import="com.liferay.portal.kernel.util.HashMapBuilder" %><%@
page import="com.liferay.portal.kernel.util.HtmlUtil" %><%@
page import="com.liferay.portal.kernel.util.ListUtil" %><%@
page import="com.liferay.portal.kernel.util.PortalUtil" %><%@
page import="com.liferay.portal.kernel.util.StringBundler" %><%@
page import="com.liferay.portal.kernel.util.Validator" %><%@
page import="com.liferay.portal.util.PropsValues" %><%@
page import="com.liferay.portal.util.ResourcePermissionUtil" %><%@
page import="com.liferay.portlet.configuration.icon.action.ActionUtil" %><%@
page import="com.liferay.portlet.configuration.icon.permissions.display.context.PortletConfigurationPermissionsDisplayContext" %><%@
page import="com.liferay.roles.admin.constants.RolesAdminWebKeys" %><%@
page import="com.liferay.roles.admin.role.type.contributor.RoleTypeContributor" %><%@
page import="com.liferay.roles.admin.role.type.contributor.provider.RoleTypeContributorProvider" %>

<%@ page import="java.util.ArrayList" %><%@
page import="java.util.Collections" %><%@
page import="java.util.List" %><%@
page import="java.util.Map" %>

<liferay-frontend:defineObjects />

<liferay-theme:defineObjects />

<portlet:defineObjects />

<%!
private String _getActionLabel(HttpServletRequest request, String resourceName, String actionId) {
	String actionLabel = null;

	if (actionId.equals("ADD_STRUCTURE") && resourceName.equals("com.liferay.document.library")) {
		actionLabel = LanguageUtil.get(request, "add-metadata-set");
	}

	if (actionLabel == null) {
		actionLabel = ResourceActionsUtil.getAction(request, actionId);
	}

	return actionLabel;
}
%>