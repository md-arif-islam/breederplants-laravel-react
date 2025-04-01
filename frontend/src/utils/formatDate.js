// src/utils/formatDate.js

/**
 * Formats a date string into 'dd-mm-yyyy' format.
 * @param {string|Date} dateInput - The date string or Date object to format.
 * @returns {string} Formatted date string in 'dd-mm-yyyy' format.
 */
export function formatDate(dateInput) {
    const date = new Date(dateInput);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
