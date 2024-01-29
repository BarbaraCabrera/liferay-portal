/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayDatePicker from '@clayui/date-picker';
import {ClayInput} from '@clayui/form';
import {sub} from 'frontend-js-web';
import React, {useState} from 'react';
import ClayAlert from "@clayui/alert";

export default function ScheduleOptions({
	displayDate,
	formId,
	portletNamespace,
	timeZone,
}) {
	const [value, setValue] = useState(displayDate);
	const {day, hour, minutes, month, year} = getDate(value);
	const [error, setError] = useState('');

	const isValidDate = () => {

		if (value.valueOf() < new Date().valueOf()){
			setError(Liferay.Language.get('the-date-entered-has-already-occurred'));
			return false;
		} else if (moment(value, 'YYYY/MM/DD', true).isValid()) {
			setError(Liferay.Language.get('please-enter-a-valid-date'));
			return false;
		}else{
			setError(Liferay.Language.get(''));
			return true;
		}
	}

	return (
		<>
			<label htmlFor={`${portletNamespace}displayDatePicker`}>
				{Liferay.Language.get('date-and-time')}
			</label>

			<ClayDatePicker
				id={`${portletNamespace}displayDatePicker`}
				onChange={setValue}
				placeholder="YYYY-MM-DD HH:mm"
				time
				timezone={timeZone}
				value={value}
				years={{
					end: 9999,
					start: new Date().getFullYear(),
				}}
			/>

			{!isValidDate ?
				<div className="error-container mt-1">
					<ClayAlert
						className="mt-1"
						displayType="danger"
						title={Liferay.Language.get('error-colon') + ' '}
						variant="feedback"
					>
						{error}
					</ClayAlert>
				</div>
			: null}


			<p className="text-3 text-secondary">
				{sub(Liferay.Language.get('time-zone-x'), timeZone)}
			</p>

			<ClayInput
				form={formId}
				name={`${portletNamespace}displayDateDay`}
				type="hidden"
				value={day}
			/>

			<ClayInput
				form={formId}
				name={`${portletNamespace}displayDateHour`}
				type="hidden"
				value={hour}
			/>

			<ClayInput
				form={formId}
				name={`${portletNamespace}displayDateMinutes`}
				type="hidden"
				value={minutes}
			/>

			<ClayInput
				form={formId}
				name={`${portletNamespace}displayDateMonth`}
				type="hidden"
				value={month}
			/>

			<ClayInput
				form={formId}
				name={`${portletNamespace}displayDateYear`}
				type="hidden"
				value={year}
			/>
		</>
	);
}

function getDate(value) {
	if (value) {
		const date = new Date(value);

		return {
			day: date.getDate(),
			hour: date.getHours(),
			minutes: date.getMinutes(),
			month: date.getMonth() + 1,
			year: date.getFullYear(),
		};
	}

	return {day: '', hour: '', minutes: '', month: '', year: ''};
}
