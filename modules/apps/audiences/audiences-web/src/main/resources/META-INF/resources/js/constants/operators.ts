/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const RELATIONAL_OPERATOR_LABELS: Record<string, string> = {
	gt: Liferay.Language.get('greater-than'),
	gte: Liferay.Language.get('greater-than-or-equals'),
	lt: Liferay.Language.get('less-than'),
	lte: Liferay.Language.get('less-than-or-equals'),
};

const SHARED_OPERATOR_LABELS: Record<string, string> = {
	eq: Liferay.Language.get('equals'),
	includes: Liferay.Language.get('contains'),
	not_eq: Liferay.Language.get('not-equals'),
	not_includes: Liferay.Language.get('does-not-contain'),
};

const SEGMENTS_OPERATOR_LABELS: Record<string, string> = {
	includes: Liferay.Language.get('belongs-to'),
	not_includes: Liferay.Language.get('does-not-belong-to'),
};

const EQUALITY_OPERATORS = ['eq', 'not_eq'];

const ORDERED_OPERATORS = ['eq', 'not_eq', 'gt', 'lt', 'gte', 'lte'];

const SET_OPERATORS = ['includes', 'not_includes'];

const TEXT_OPERATORS = ['eq', 'not_eq', 'includes', 'not_includes'];

export function getOperatorLabel(operator: string, attribute?: string): string {
	if (attribute === 'segments' && SEGMENTS_OPERATOR_LABELS[operator]) {
		return SEGMENTS_OPERATOR_LABELS[operator];
	}

	return (
		SHARED_OPERATOR_LABELS[operator] ||
		RELATIONAL_OPERATOR_LABELS[operator] ||
		operator
	);
}

export function getOperators(inputType: string, type: string): string[] {
	if (inputType === 'date') {
		return ORDERED_OPERATORS;
	}

	if (type === 'boolean') {
		return EQUALITY_OPERATORS;
	}

	if (type === 'set') {
		return SET_OPERATORS;
	}

	if (type === 'number') {
		return ORDERED_OPERATORS;
	}

	if (inputType === 'select') {
		return EQUALITY_OPERATORS;
	}

	return TEXT_OPERATORS;
}
