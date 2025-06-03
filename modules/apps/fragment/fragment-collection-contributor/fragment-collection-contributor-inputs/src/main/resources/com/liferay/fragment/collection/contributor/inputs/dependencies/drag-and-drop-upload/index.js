/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const changeButton = document.getElementById(
	`${fragmentNamespace}-drag-and-drop-upload-change-button`
);
const dropzone = document.getElementById(
	`${fragmentNamespace}-drag-and-drop-upload-dropzone`
);
const fileInput = document.getElementById(
	`${fragmentNamespace}-drag-and-drop-upload`
);
const removeButton = document.getElementById(
	`${fragmentNamespace}-drag-and-drop-upload-remove-button`
);
const selectButton = document.getElementById(
	`${fragmentNamespace}-drag-and-drop-upload-button`
);
const hiddenFileInput = document.getElementById(
	`${fragmentNamespace}-drag-and-drop-upload-hidden`
);
const previewContainer = document.getElementById(
	`${fragmentNamespace}-drag-and-drop-upload-preview`
);
const previewContent = document.getElementById(
	`${fragmentNamespace}-drag-and-drop-upload-preview-content`
);
const defaultDropzone = dropzone.querySelector('.dropzone-default-content');
const noPreviewDropzone = dropzone.querySelector('.dropzone-no-preview');
const unlocalizedInfo = document.getElementById(
	`${fragmentNamespace}-unlocalized-info`
);
const helpText = document.getElementById(
	`${fragmentNamespace}-drag-and-drop-upload-help-text`
);

function showRemoveButton() {
	removeButton.classList.remove('d-none');
	removeButton.addEventListener('click', onRemoveFile);
}

let previousFiles = null;
let previewURL = null;

function onInputChange() {
	if (!fileInput.files.length && previousFiles) {
		const dataTransfer = new DataTransfer();

		dataTransfer.items.add(previousFiles);

		fileInput.files = dataTransfer.files;
	}

	showPreview(fileInput.files[0]);
	fileInput.setAttribute('name', input.name);

	hiddenFileInput.setAttribute('name', '');
	hiddenFileInput.value = '';

	showRemoveButton();
	showChangeButton();

	changeButton.focus();
}

function onRemoveFile() {
	previousFiles = null;

	fileInput.value = '';

	hiddenFileInput.value = '';

	removeButton.classList.add('d-none');
	changeButton.classList.add('d-none');
	dropzone.classList.remove('d-none');
	defaultDropzone.classList.remove('d-none');
	noPreviewDropzone.classList.add('d-none');
	previewContainer.classList.add('d-none');
	removeButton.removeEventListener('click', onRemoveFile);

	selectButton.focus();
}

function onSelectFile(event, onChange, setTranslationInputValue) {
	event.preventDefault();

	Liferay.Util.openSelectionModal({
		onSelect(selectedItem) {
			const {fileEntryId, url} = JSON.parse(selectedItem.value);

			if (onChange) {
				setTranslationInputValue({
					previewURL: url,
					value: fileEntryId,
				});

				onChange();
			}

			fileInput.value = fileEntryId;

			showPreview(selectedItem);
			showRemoveButton();
			showChangeButton();
		},
		selectEventName: `${fragmentNamespace}selectFileEntry`,
		url: input.attributes.selectFromDocumentLibraryURL,
	});
}

const onSelectFromUserComputer = () => {
	previousFiles = fileInput.files[0] || null;

	fileInput.click();
};

let selectFileEvent = onSelectFromUserComputer;

if (layoutMode === 'edit') {
	selectButton.classList.add('disabled');
}
else {
	if (input.attributes.selectFromDocumentLibrary) {
		selectFileEvent = onSelectFile;
	}

	fileInput.addEventListener('change', onInputChange);

	if (Liferay.FeatureFlags['LPD-37927']) {
		const defaultLanguageId = themeDisplay.getDefaultLanguageId();
		const inputElement = fileInput;

		let currentLanguageId = defaultLanguageId;

		import('@liferay/fragment-impl/api').then(
			({
				getOrCreateTranslationInput,
				registerLocalizedInput,
				registerUnlocalizedInput,
			}) => {
				if (input.localizable) {

					// Set initial values

					const initialValues = Object.keys(input.valueI18n).map(
						(key) => [
							key,
							{
								fileEntryId: input.valueI18n[key],
								previewURL:
									input.attributes.previewURLI18n[key] || '',
							},
						]
					);

					Object.entries(initialValues).forEach(
						([languageId, value]) => {
							const input = getOrCreateTranslationInput(
								inputElement?.id,
								inputElement.name,
								languageId,
								inputElement.parentNode,
								fragmentNamespace
							);

							input.value = value.fileEntryId;
							input.dataset.previewURL = value.previewURL;
						}
					);

					if (input.attributes?.previewURL) {
						showPreview(input.attributes.previewURL);
						showChangeButton();
						showRemoveButton();
					}

					const isFromDocumentLibrary =
						input.attributes.selectFromDocumentLibrary;

					const {onChange} = registerLocalizedInput({
						changeTextDirection: false,
						customLocaleChangeHandler: true,
						defaultLanguageId,
						onLocaleChange: ({languageId}) => {
							currentLanguageId = languageId;
						},
					});

					const setTranslationInputValue = ({previewURL, value}) => {
						const type =
							isFromDocumentLibrary === false ? 'file' : 'hidden';

						const translationInput = getOrCreateTranslationInput(
							`${input.name}-drag-and-drop-upload`,
							input.name,
							currentLanguageId,
							inputElement.parentNode,
							fragmentNamespace,
							type
						);

						if (isFromDocumentLibrary) {
							translationInput.value = value;
							translationInput.dataset.previewURL = previewURL;
						}
						else {
							const files = value;

							if (files?.length) {
								const dataTransfer = new DataTransfer();

								[...files].forEach((file) => {
									dataTransfer.items.add(file);
								});

								translationInput.files = dataTransfer.files;
								translationInput.dataset.previewURL =
									URL.createObjectURL(dataTransfer.files[0]);
							}
						}

						showPreview(translationInput.dataset.previewURL);
						showChangeButton();
						showRemoveButton();
					};

					if (isFromDocumentLibrary) {
						selectButton.addEventListener('click', (event) => {
							onSelectFile(
								event,
								onChange,
								setTranslationInputValue
							);
						});
					}
					else {
						inputElement.addEventListener('change', (event) => {
							setTranslationInputValue({
								value: event.target.files,
							});

							onChange();
						});

						selectButton.addEventListener(
							'click',
							onSelectFromUserComputer
						);
					}

					removeButton.addEventListener('click', () => {
						removeButton.classList.add('d-none');

						const translationInput = getOrCreateTranslationInput(
							`${input.name}-drag-and-drop-upload`,
							input.name,
							currentLanguageId,
							inputElement.parentNode,
							fragmentNamespace
						);

						translationInput.value = '';
						translationInput.dataset.previewURL = '';
					});
				}
				else {
					const unlocalizedFieldsState =
						input.attributes.unlocalizedFieldsState;

					if (input.attributes?.previewURL) {
						showPreview(input.attributes.previewURL);
						showChangeButton();
						showRemoveButton();
					}

					registerUnlocalizedInput({
						changeTextDirection: false,
						customLocaleChangeHandler: true,
						defaultLanguageId,
						inputElement,
						onLocaleChange: (languageId) => {
							currentLanguageId = languageId;

							if (defaultLanguageId !== languageId) {
								selectButton.setAttribute('disabled', true);
								dropzone.parentNode.style.opacity = '0.4';
								unlocalizedInfo.classList.remove('d-none');

								if (previewURL) {
									changeButton.setAttribute('disabled', true);
									removeButton.setAttribute('disabled', true);
								}

								if (unlocalizedFieldsState === 'disabled') {
									helpText.style.opacity = '0.4';
								}
							}
							else {
								selectButton.removeAttribute('disabled');
								dropzone.parentNode.style.opacity = '1';
								unlocalizedInfo.classList.add('d-none');
								helpText.style.opacity = '1';

								if (previewURL) {
									changeButton.removeAttribute('disabled');
									removeButton.removeAttribute('disabled');
								}
							}
						},
						readOnlyInputLabel: document.getElementById(
							`${fragmentEntryLinkNamespace}-drag-and-drop-upload-read-only`
						),
						unlocalizedFieldsState,
						unlocalizedMessageContainer: document.getElementById(
							`${fragmentNamespace}-unlocalized-info`
						),
					});

					selectButton.addEventListener('click', selectFileEvent);
				}
			}
		);
	}
	else {
		selectButton.addEventListener('click', selectFileEvent);
	}

	defaultDropzone.addEventListener('dragover', (event) => {
		event.preventDefault();
		defaultDropzone.classList.add('dropzone-hover');
	});

	defaultDropzone.addEventListener('dragleave', () => {
		defaultDropzone.classList.remove('dropzone-hover');
	});

	defaultDropzone.addEventListener('drop', (event) => {
		event.preventDefault();
		defaultDropzone.classList.remove('dropzone-hover');

		const files = event.dataTransfer.files;

		if (!files.length) {
			return;
		}

		const file = files[0];

		previousFiles = file;
		showPreview(file);

		fileInput.setAttribute('name', input.name);
		hiddenFileInput.setAttribute('name', '');
		hiddenFileInput.value = '';

		showRemoveButton();
		showChangeButton();
	});
}

function showChangeButton() {
	changeButton.classList.remove('d-none');
	changeButton.addEventListener('click', selectFileEvent);
}

function showPreview(fileOrUrl) {
	if (!fileOrUrl) {
		previewContainer.classList.add('d-none');
		dropzone.classList.remove('d-none');
		defaultDropzone.classList.add('d-none');
		noPreviewDropzone.classList.remove('d-none');

		return;
	}

	let isImage = false;

	if (typeof fileOrUrl === 'string') {
		isImage = true;
		previewURL = fileOrUrl;
	}
	else if (fileOrUrl.value) {
		const fileData = JSON.parse(fileOrUrl.value);
		const {type, url} = fileData;

		const isFromDocumentsAndMedia = type?.startsWith('document');

		if (isFromDocumentsAndMedia && url) {
			isImage = true;
			previewURL = url;
		}
	}
	else if (fileOrUrl.type?.startsWith('image/')) {
		isImage = true;
		previewURL = URL.createObjectURL(fileOrUrl);
	}

	if (isImage && previewURL) {
		dropzone.classList.add('d-none');
		previewContainer.classList.remove('d-none');
		previewContent.innerHTML = '';

		const image = document.createElement('img');
		image.src = previewURL;
		image.alt = '';
		image.style.width = '100%';

		previewContent.appendChild(image);
	}
	else {
		previewContainer.classList.add('d-none');
		dropzone.classList.remove('d-none');
		defaultDropzone.classList.add('d-none');
		noPreviewDropzone.classList.remove('d-none');
	}
}
