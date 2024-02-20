/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayModal, {useModal} from "@clayui/modal";

import React, {useState} from "react";
import ClayIcon from "@clayui/icon";
import ClayForm, {ClayInput} from "@clayui/form";
import {useIsMounted} from "@clayui/core/lib/hooks";
import {navigate} from 'frontend-js-web';
import ClayAlert from "@clayui/alert";
import ClayButton from "@clayui/button";

import PermissionsOptions from "./PermissionsOptions";

interface Props {
    formSubmitURL: string;
    heading: string;
    mainFieldValue: string;
    method: string;
    onCloseModal: () => void;
    permissions: boolean;
    permissionsURL: string;
    portletNamespace: string;
    secondaryFieldValue: string;
}

function CreationModal({
    formSubmitURL,
    heading,
    mainFieldValue = '',
    method = 'POST',
    onCloseModal,
    permissions,
    permissionsURL,
    portletNamespace,
    secondaryFieldValue = '',
}: Props) {

    const isMounted = useIsMounted();

     const {observer, onClose} = useModal({
        onClose: () => {
            onCloseModal();
        },
    });

    const [loadingResponse, setLoadingResponse] = useState<boolean>(false);
    const [mainInputValue, setMainInputValue] = useState<string>(mainFieldValue);
    const [mainInputError, setMainInputError] = useState<string>('');
    const [secondaryInputValue, setSecondaryInputValue] = useState<string>(secondaryFieldValue);

    const handleFormError = (error: string) => {
        setMainInputError(error || '');
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();

        const error = mainInputValue
            ? ''
            : Liferay.Language.get('this-field-is-required');

        if (error) {
            setMainInputError(error);

            return;
        }

        const form = document.querySelector(`#${portletNamespace}form`) as HTMLFormElement;

        if(!form) {
            return;
        }

        const formData = new FormData(form);

        fetch(formSubmitURL, {
            body: formData,
            method,
        })
            .then((response) => response.json())
            .then((responseContent) => {
                if (isMounted()) {
                    if (responseContent.error) {
                        setLoadingResponse(false);

                        handleFormError(responseContent.error);
                    }
                    else {
                        onClose();

                        if (responseContent.redirectURL) {
                            navigate(responseContent.redirectURL);
                        }
                    }
                }
            })
            .catch((response) => {
                handleFormError(response);
            });
    };

    return (
    <ClayModal className="m-0" observer={observer}>
        <ClayModal.Header>{heading}</ClayModal.Header>

        <ClayForm
            id={`${portletNamespace}form`}
            // @ts-ignore
            noValidate
            onSubmit={handleSubmit}
        >
            <ClayModal.Body className="m-0">
                <label
                    className="control-label"
                    htmlFor={`${portletNamespace}name`}
                >
                    {Liferay.Language.get('name')}

                    <span className="reference-mark">
                        <ClayIcon symbol="asterisk" />
                    </span>

                </label>

                <ClayInput
                    autoFocus
                    className="form-control"
                    component="input"
                    disabled={loadingResponse}
                    id={`${portletNamespace}name`}
                    name={`${portletNamespace}name`}
                    onChange={(event) => {
                            setMainInputError(
                                event.target.value
                                    ? ''
                                    : Liferay.Language.get(
                                        'this-field-is-required'
                                    )
                            );

                        setMainInputValue(event.target.value);
                    }}
                    required={true}
                    type="text"
                    value={mainInputValue}
                />

                {mainInputError && (
                    <ClayAlert
                        displayType="danger"
                        title={`${Liferay.Language.get('error')}:`}
                        variant="feedback"
                    >
                        {mainInputError}
                    </ClayAlert>
                )}

                <label
                    className="control-label c-mt-4"
                    htmlFor={`${portletNamespace}description`}
                >
                    {Liferay.Language.get('description')}

                </label>

                <ClayInput
                    autoFocus
                    className="form-control"
                    component="textarea"
                    disabled={loadingResponse}
                    id={`${portletNamespace}description`}
                    name={`${portletNamespace}description`}
                    onChange={(event) => setSecondaryInputValue(event.target.value)}
                    type="text"
                    value={secondaryInputValue}
                />

                {permissions && (
                    <>
                        <div className="c-mt-4">
                            <PermissionsOptions
                                formId="form"
                                permissionsURL={permissionsURL}
                            />
                        </div>
                    </>
                )}

            </ClayModal.Body>

            <ClayModal.Footer
                last={
                    <ClayButton.Group spaced>
                        <ClayButton
                            disabled={loadingResponse}
                            displayType="secondary"
                            onClick={onClose}
                        >
                            {Liferay.Language.get('cancel')}
                        </ClayButton>

                        <ClayButton
                            disabled={loadingResponse}
                            displayType="primary"
                            type='submit'
                        >
                            {loadingResponse && (
                                <span className="inline-item inline-item-before">
                                    <span
                                        aria-hidden="true"
                                        className="loading-animation"
                                    ></span>
                                </span>
                            )}

                            {Liferay.Language.get('create')}
                        </ClayButton>
                    </ClayButton.Group>
                }
            />
        </ClayForm>
    </ClayModal>
);
}

export default CreationModal;