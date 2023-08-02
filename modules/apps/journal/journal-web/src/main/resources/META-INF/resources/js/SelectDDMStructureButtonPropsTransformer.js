/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {openSelectionModal} from 'frontend-js-web';

export default function propsTransformer({
	 additionalProps: {
		 DDMStructureURL,
		 removeDDMStructureButton,
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

						const removeStructureButton = removeDDMStructureButton.replace(
							/DDM_STRUCTURE_ID_BUTTON/g, itemValue.ddmstructureid);

						if (workflowEnabled) {

							let workflowDefinitions = workflowDefinitionsBuffer;

							workflowDefinitions = workflowDefinitions.replace(
								/DDM_STRUCTURE_ID/g,
								'workflowDefinition' +
								itemValue.ddmstructureid
							);

							searchContainer.addRow(
								[
									itemValue.name,
									workflowDefinitions,
									removeStructureButton,
								],
								itemValue.ddmstructureid
							);
						}
						else {
							searchContainer.addRow(
								[itemValue.name, removeStructureButton],
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
				`${portletNamespace}selectDDMStructureButton`
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
