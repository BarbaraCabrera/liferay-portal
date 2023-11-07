<%--
/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
--%>

<%@ include file="/init.jsp" %>

<%
AssetDisplayPagesItemSelectorCustomViewDisplayContext assetDisplayPagesItemSelectorCustomViewDisplayContext = (AssetDisplayPagesItemSelectorCustomViewDisplayContext)request.getAttribute(AssetDisplayPagesItemSelectorCustomViewDisplayContext.class.getName());
%>

<clay:container-fluid
	cssClass="container-view sidenav-content"
>
	<%-- <liferay-site-navigation:breadcrumb--%>
	<%-- breadcrumbEntries="<%= assetDisplayPagesItemSelectorCustomViewDisplayContext.getLayoutPageTemplateBreadcrumbEntries() %>"--%>

	<liferay-ui:search-container
		id="displayPages"
		searchContainer="<%= assetDisplayPagesItemSelectorCustomViewDisplayContext.getAssetDisplayPageSearchContainer() %>"
	>
		<liferay-ui:search-container-row
			className="Object"
			modelVar="object"
		>

			<%
			LayoutPageTemplateCollection curLayoutPageTemplateCollection = null;
			LayoutPageTemplateEntry curLayoutPageTemplateEntry = null;

			Object result = row.getObject();

			if (result instanceof LayoutPageTemplateEntry) {
				curLayoutPageTemplateEntry = (LayoutPageTemplateEntry)result;
			}
			else {
				curLayoutPageTemplateCollection = (LayoutPageTemplateCollection)result;
			}
			%>

			<c:choose>
				<c:when test="<%= curLayoutPageTemplateCollection != null %>">
					<liferay-ui:search-container-column-text
						colspan="<%= 2 %>"
					>
						<clay:horizontal-card
							horizontalCard="<%= new DisplayPageTemplateCollectionHorizontalCard (curLayoutPageTemplateCollection, renderRequest, renderResponse, searchContainer.getRowChecker()) %>"
						/>
					</liferay-ui:search-container-column-text>
				</c:when>
				<c:when test="<%= curLayoutPageTemplateEntry != null %>">
					<liferay-ui:search-container-column-text>
						<clay:vertical-card
							verticalCard="<%= new DisplayPageVerticalCard(curLayoutPageTemplateEntry, request, renderRequest, searchContainer.getRowChecker()) %>"
						/>
					</liferay-ui:search-container-column-text>
				</c:when>
			</c:choose>
		</liferay-ui:search-container-row>

		<liferay-ui:search-iterator
			displayStyle="icon"
			markupView="lexicon"
			resultRowSplitter="<%= assetDisplayPagesItemSelectorCustomViewDisplayContext.isSearch() ? null : new LayoutPageTemplateResultRowSplitter() %>"
		/>
	</liferay-ui:search-container>
</clay:container-fluid>