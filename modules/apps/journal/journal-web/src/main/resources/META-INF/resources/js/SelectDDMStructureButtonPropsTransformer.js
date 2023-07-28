/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {openSelectionModal} from 'frontend-js-web';

export default function propsTransformer({
	 additionalProps: {
		 DDMStructureURL,
		 removeDDMStructureIcon,
		 workflowDefinitionsBuffer,
		 workflowEnabled},
	 portletNamespace,
	 ...props
}) {
	return {
		...props,
		onClick() {

			openSelectionModal({
				height: '70vh',
				iframeBodyCssClass: '',
				onSelect: (selectedItem) => {

					if (selectedItem) {
						const itemValue = JSON.parse(selectedItem.value);

						const ddmStructureLink = `
								<button 
									aria-label=${Liferay.Language.get('remove')} 
									class="btn btn-monospaced btn-outline-borderless btn-outline-secondary float-right modify-link" 
									data-rowId="${itemValue.ddmstructureid}" 
									title=${Liferay.Language.get('remove')}
									>
									${removeDDMStructureIcon}
									</button>`;

						if (workflowEnabled) {
							let workflowDefinitions = workflowDefinitionsBuffer;

							workflowDefinitions = workflowDefinitions.replace(
								/LIFERAY_WORKFLOW_DEFINITION_DDM_STRUCTURE/g,
								'workflowDefinition' +
								itemValue.ddmstructureid
							);

							searchContainer.addRow(
								[
									itemValue.name,
									workflowDefinitions,
									ddmStructureLink,
								],
								itemValue.ddmstructureid
							);
						}
						else {
							searchContainer.addRow(
								[itemValue.name, ddmStructureLink],
								itemValue.ddmstructureid
							);
						}

						searchContainer.updateDataStore();
					}
				},
				selectEventName: `${portletNamespace}selectDDMStructure`,
				title: Liferay.Language.get('structures'),
				url: DDMStructureURL,
			});

			const searchContainer = Liferay.SearchContainer.get(
				`${portletNamespace}ddmStructuresSearchContainer`
			);

			const selectDDMStructureButton = document.getElementById(
				`${portletNamespace}selectDDMStructure`
			);

			if (selectDDMStructureButton) {

				searchContainer.get('contentBox').delegate(
					'click',
					(event) => {
						const link = event.currentTarget;

						const tr = link.ancestor('tr');

						searchContainer.deleteRow(tr, link.attr('data-rowId'));
					},
					'.modify-link'
				);

			}
		},
	};
}
