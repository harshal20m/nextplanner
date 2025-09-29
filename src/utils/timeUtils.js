// src/utils/timeUtils.js

export const parseTimeForSorting = (timeString) => {
	// Extract time from strings like "Morning Study (6:00 AM - 8:00 AM)"
	const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
	if (timeMatch) {
		let hours = parseInt(timeMatch[1]);
		const minutes = parseInt(timeMatch[2]);
		const period = timeMatch[3].toUpperCase();

		// Convert to 24-hour format
		if (period === "PM" && hours !== 12) {
			hours += 12;
		} else if (period === "AM" && hours === 12) {
			hours = 0;
		}

		return hours * 60 + minutes; // Return minutes since midnight
	}

	// Fallback: try to parse as direct time format
	const directTimeMatch = timeString.match(/(\d{1,2}):(\d{2})/);
	if (directTimeMatch) {
		const hours = parseInt(directTimeMatch[1]);
		const minutes = parseInt(directTimeMatch[2]);
		return hours * 60 + minutes;
	}

	// If no time found, return a large number to sort to end
	return 9999;
};

export const convertTo12HourFormat = (timeString) => {
	// If already in 12-hour format, return as is
	if (timeString.includes("AM") || timeString.includes("PM")) {
		return timeString;
	}

	// Extract time from strings like "Morning Study (6:00 - 8:00)"
	const timeMatch = timeString.match(/(\d{1,2}):(\d{2})/);
	if (timeMatch) {
		let hours = parseInt(timeMatch[1]);
		const minutes = timeMatch[2];
		const period = hours >= 12 ? "PM" : "AM";

		// Convert to 12-hour format
		if (hours === 0) {
			hours = 12;
		} else if (hours > 12) {
			hours -= 12;
		}

		// Replace the time in the original string
		return timeString.replace(/(\d{1,2}):(\d{2})/, `${hours}:${minutes} ${period}`);
	}

	return timeString;
};

export const formatTime = (date) => {
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? "PM" : "AM";
	const displayHours = hours % 12 || 12;
	const displayMinutes = minutes.toString().padStart(2, "0");
	return `${displayHours}:${displayMinutes} ${ampm}`;
};

export const getCurrentTimeString = () => {
	return formatTime(new Date());
};

export const isTimeInRange = (timeString, currentTime) => {
	const timeMatch = timeString.match(/(\d{1,2}):(\d{2})\s*(AM|PM).*?(\d{1,2}):(\d{2})\s*(AM|PM)/i);
	if (!timeMatch) return false;

	const startHours = parseInt(timeMatch[1]);
	const startMinutes = parseInt(timeMatch[2]);
	const startPeriod = timeMatch[3].toUpperCase();
	const endHours = parseInt(timeMatch[4]);
	const endMinutes = parseInt(timeMatch[5]);
	const endPeriod = timeMatch[6].toUpperCase();

	// Convert to 24-hour format
	let start24 = startHours;
	let end24 = endHours;

	if (startPeriod === "PM" && startHours !== 12) start24 += 12;
	else if (startPeriod === "AM" && startHours === 12) start24 = 0;

	if (endPeriod === "PM" && endHours !== 12) end24 += 12;
	else if (endPeriod === "AM" && endHours === 12) end24 = 0;

	const startMinutesTotal = start24 * 60 + startMinutes;
	const endMinutesTotal = end24 * 60 + endMinutes;
	const currentMinutesTotal = currentTime.getHours() * 60 + currentTime.getMinutes();

	return currentMinutesTotal >= startMinutesTotal && currentMinutesTotal <= endMinutesTotal;
};
