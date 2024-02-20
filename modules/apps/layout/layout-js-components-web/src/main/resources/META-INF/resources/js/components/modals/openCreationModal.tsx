/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {render} from '@liferay/frontend-js-react-web';
import React from 'react';
import {unmountComponentAtNode} from 'react-dom';
import CreationModal from "./CreationModal";

const DEFAULT_MODAL_CONTAINER_ID = 'modalContainer';

const DEFAULT_RENDER_DATA = {
    portletId: 'UNKNOWN_PORTLET_ID',
};

interface Props {
    formSubmitURL: string;
    heading: string;
    mainFieldValue: string;
    method: string;
    portletNamespace: string;
    secondaryFieldValue: string;
}

function getDefaultModalContainer() {
    let container = document.getElementById(DEFAULT_MODAL_CONTAINER_ID);

    if (!container) {
        container = document.createElement('div');
        container.id = DEFAULT_MODAL_CONTAINER_ID;
        document.body.appendChild(container);
    }

    return container;
}

function dispose() {
    unmountComponentAtNode(getDefaultModalContainer());
}

function openCreationModalImplementation({
    formSubmitURL,
    heading,
    mainFieldValue,
    portletNamespace,
    secondaryFieldValue,
}: Props){
    dispose();

    render(
        <CreationModal
            formSubmitURL={formSubmitURL}
			heading={heading}
            mainFieldValue={mainFieldValue}
            onCloseModal={dispose}
            portletNamespace={portletNamespace}
            secondaryFieldValue={secondaryFieldValue}
            method="POST"
        />,
        DEFAULT_RENDER_DATA,
        getDefaultModalContainer()
);

}

export function openCreationModal(data: Props) {
    return openCreationModalImplementation.call(null, data);
}

export default openCreationModalImplementation;