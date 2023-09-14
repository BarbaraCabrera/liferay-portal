<%--
/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
--%>

<%@ include file="/init.jsp" %>

<%
DisplayPageDisplayContext displayPageDisplayContext = new DisplayPageDisplayContext(request, renderRequest, renderResponse);

LayoutPageTemplateCollection layoutPageTemplateCollection = displayPageDisplayContext.getLayoutPageTemplateCollection();
%>

<div class="sidebar-header">
	<clay:content-row
		cssClass="sidebar-section"
	>
		<clay:content-col
			expand="<%= true %>"
		>
			<h1 class="component-title"><%= (layoutPageTemplateCollection != null) ? HtmlUtil.escape(layoutPageTemplateCollection.getName()) : LanguageUtil.get(request, "home") %></h1>

			<h2 class="component-subtitle">
				<liferay-ui:message key="folder" />
			</h2>
		</clay:content-col>
	</clay:content-row>
</div>

<div class="sidebar-body">

		<clay:button
			displayType="secondary"
			id='<%= liferayPortletResponse.getNamespace() + "permissions" %>'
			label='<%= LanguageUtil.get(request, "manage-permissions") %>'
		/>

<%--	<p class="sidebar-dt"><liferay-ui:message key="location" /></p>--%>

	<%--	<p class="sidebar-dd">--%>
	<%--		<%= HtmlUtil.escape(layoutPageTemplateCollection.get) %>--%>
	<%--	</p>--%>

	<p class="sidebar-dt"><liferay-ui:message key="num-of-items" /></p>

	<c:if test="<%= layoutPageTemplateCollection != null %>">
		<p class="sidebar-dd">
			<%=
			LayoutPageTemplateEntryServiceUtil.getLayoutPageCollectionsAndLayoutPageTemplateEntriesCount(
				layoutPageTemplateCollection.getGroupId(),
				layoutPageTemplateCollection.getLayoutPageTemplateCollectionId(),
				layoutPageTemplateCollection.getType())
			%>

		</p>

		<p class="sidebar-dt"><liferay-ui:message key="created" /></p>

		<p class="sidebar-dd">
			<%= HtmlUtil.escape(layoutPageTemplateCollection.getCreateDate().toString()) %>
		</p>

		<p class="sidebar-dt"><liferay-ui:message key="modified" /></p>

		<p class="sidebar-dd">
			<%= HtmlUtil.escape(layoutPageTemplateCollection.getModifiedDate().toString()) %>
		</p>

		<p class="sidebar-dt"><liferay-ui:message key="description" /></p>

		<p class="sidebar-dd">
			<%= HtmlUtil.escape(layoutPageTemplateCollection.getDescription()) %>
		</p>
	</c:if>
</div>