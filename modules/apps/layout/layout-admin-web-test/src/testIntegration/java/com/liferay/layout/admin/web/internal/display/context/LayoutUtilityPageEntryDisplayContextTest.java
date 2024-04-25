/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.layout.admin.web.internal.display.context;

import com.liferay.arquillian.extension.junit.bridge.junit.Arquillian;
import com.liferay.layout.utility.page.kernel.LayoutUtilityPageEntryViewRenderer;
import com.liferay.layout.utility.page.kernel.LayoutUtilityPageEntryViewRendererRegistryUtil;
import com.liferay.layout.utility.page.kernel.constants.LayoutUtilityPageEntryConstants;
import com.liferay.layout.utility.page.model.LayoutUtilityPageEntry;
import com.liferay.layout.utility.page.service.LayoutUtilityPageEntryLocalService;
import com.liferay.layout.utility.page.service.LayoutUtilityPageEntryService;
import com.liferay.petra.function.transform.TransformUtil;
import com.liferay.portal.kernel.dao.search.SearchContainer;
import com.liferay.portal.kernel.exception.PortalException;
import com.liferay.portal.kernel.model.Company;
import com.liferay.portal.kernel.model.Group;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.portlet.bridges.mvc.MVCPortlet;
import com.liferay.portal.kernel.portlet.bridges.mvc.constants.MVCRenderConstants;
import com.liferay.portal.kernel.service.CompanyLocalService;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.test.ReflectionTestUtil;
import com.liferay.portal.kernel.test.portlet.MockLiferayPortletRenderRequest;
import com.liferay.portal.kernel.test.portlet.MockLiferayPortletRenderResponse;
import com.liferay.portal.kernel.test.rule.AggregateTestRule;
import com.liferay.portal.kernel.test.rule.DeleteAfterTestRun;
import com.liferay.portal.kernel.test.rule.Sync;
import com.liferay.portal.kernel.test.rule.SynchronousDestinationTestRule;
import com.liferay.portal.kernel.test.util.GroupTestUtil;
import com.liferay.portal.kernel.test.util.RandomTestUtil;
import com.liferay.portal.kernel.test.util.ServiceContextTestUtil;
import com.liferay.portal.kernel.test.util.TestPropsValues;
import com.liferay.portal.kernel.test.util.UserTestUtil;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.LocaleUtil;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.portal.test.rule.Inject;
import com.liferay.portal.test.rule.LiferayIntegrationTestRule;
import com.liferay.portal.test.rule.PermissionCheckerMethodTestRule;
import com.liferay.portlet.test.MockLiferayPortletContext;
import org.junit.Assert;
import org.junit.Before;
import org.junit.ClassRule;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.portlet.Portlet;

/**
 * @author Bárbara Cabrera
 */
@RunWith(Arquillian.class)
@Sync
public class LayoutUtilityPageEntryDisplayContextTest {


	@ClassRule
	@Rule
	public static final AggregateTestRule aggregateTestRule =
		new AggregateTestRule(
			new LiferayIntegrationTestRule(),
			PermissionCheckerMethodTestRule.INSTANCE,
			SynchronousDestinationTestRule.INSTANCE);

	@Before
	public void setUp() throws Exception {
		_group = GroupTestUtil.addGroup();

		_company = _companyLocalService.getCompany(_group.getCompanyId());

		_user = UserTestUtil.addUser();

		_serviceContext = ServiceContextTestUtil.getServiceContext(
			_group.getGroupId(), TestPropsValues.getUserId());
	}

	@Test
	public void testGetSearchContainer() throws Exception {

		_addLayoutUtilityPageEntry("404 UP", LayoutUtilityPageEntryConstants.TYPE_SC_NOT_FOUND);
		_addLayoutUtilityPageEntry("500 UP", LayoutUtilityPageEntryConstants.TYPE_SC_INTERNAL_SERVER_ERROR);

		MockLiferayPortletRenderRequest mockLiferayPortletRenderRequest = _getMockLiferayPortletRenderRequest("utility-page");

		mockLiferayPortletRenderRequest.setParameter("keywords", "UP");

		SearchContainer<LayoutUtilityPageEntry> searchContainer = _getSearchContainer(
			mockLiferayPortletRenderRequest);

		String[] types = TransformUtil.transformToArray(
			LayoutUtilityPageEntryViewRendererRegistryUtil.
				getLayoutUtilityPageEntryViewRenderers(),
			LayoutUtilityPageEntryViewRenderer::getType, String.class);

		int up =
			_layoutUtilityPageEntryLocalService.getLayoutUtilityPageEntriesCount(
				_group.getGroupId(), "UP", types);

		int totalResults = searchContainer.getTotal();

		Assert.assertEquals(2, totalResults);

		mockLiferayPortletRenderRequest.setParameter("keywords", "404");

		searchContainer = _getSearchContainer(mockLiferayPortletRenderRequest);

		totalResults = searchContainer.getTotal();

		Assert.assertEquals(1, totalResults);

	}

	private MockLiferayPortletRenderRequest _getMockLiferayPortletRenderRequest(
		String type)
		throws Exception {

		MockLiferayPortletRenderRequest mockLiferayPortletRenderRequest =
			_getMockLiferayPortletRenderRequest();

		mockLiferayPortletRenderRequest.setParameter("type", type);

		return mockLiferayPortletRenderRequest;
	}

	private LayoutUtilityPageEntry _addLayoutUtilityPageEntry(String name, String type)
		throws PortalException {

		return _layoutUtilityPageEntryLocalService.addLayoutUtilityPageEntry(
			name, _user.getUserId(), _group.getGroupId(),
			RandomTestUtil.randomLong(), 0, false,
			name, type, 0, _serviceContext);

	}


	private SearchContainer<LayoutUtilityPageEntry> _getSearchContainer(
		MockLiferayPortletRenderRequest mockLiferayPortletRenderRequest)
	throws Exception {

		MVCPortlet mvcPortlet = (MVCPortlet)_portlet;

		mvcPortlet.render(
			mockLiferayPortletRenderRequest,
			new MockLiferayPortletRenderResponse());

		return ReflectionTestUtil.invoke(
			mockLiferayPortletRenderRequest.getAttribute(
				"com.liferay.layout.admin.web.internal.display.context.LayoutUtilityPageEntryDisplayContext"),
			"getLayoutUtilityPageEntrySearchContainer", new Class<?>[0]);

	}

	private MockLiferayPortletRenderRequest
	_getMockLiferayPortletRenderRequest()
		throws Exception {

		MockLiferayPortletRenderRequest mockLiferayPortletRenderRequest =
			new MockLiferayPortletRenderRequest();

		mockLiferayPortletRenderRequest.setAttribute(
			WebKeys.COMPANY_ID, _group.getCompanyId());

		String path = "/view.jsp";

		mockLiferayPortletRenderRequest.setAttribute(
			MVCRenderConstants.
				PORTLET_CONTEXT_OVERRIDE_REQUEST_ATTIBUTE_NAME_PREFIX + path,
			new MockLiferayPortletContext(path));

		ThemeDisplay themeDisplay = new ThemeDisplay();

		themeDisplay.setCompany(
			_companyLocalService.getCompany(_group.getCompanyId()));
		themeDisplay.setLocale(LocaleUtil.getDefault());
		themeDisplay.setScopeGroupId(_group.getGroupId());

		mockLiferayPortletRenderRequest.setAttribute(
			WebKeys.THEME_DISPLAY, themeDisplay);

		return mockLiferayPortletRenderRequest;
	}








	@Inject(
		filter = "component.name=com.liferay.layout.admin.web.internal.portlet.GroupPagesPortlet"
	)
	private Portlet _portlet;
	@Inject
	private LayoutUtilityPageEntryLocalService
		_layoutUtilityPageEntryLocalService;

	private Company _company;

	@DeleteAfterTestRun
	private User _user;
	@Inject
	private CompanyLocalService _companyLocalService;

	@DeleteAfterTestRun
	private Group _group;


	private ServiceContext _serviceContext;
}
