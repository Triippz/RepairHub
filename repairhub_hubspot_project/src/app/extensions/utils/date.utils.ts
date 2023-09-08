
export function serverDateTimeToLocal(date?: Date | string): string {
    if (!date) {
        return "N/A";
    }

    const dateObj = new Date(date);

    return dateObj.toLocaleString();
}

export function serverDateToLocalTime(dateStr?: string | Date): string {
    if (!dateStr) {
        return "N/A";
    }

    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
    }

    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const ampm = hours < 12 ? 'AM' : 'PM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const hoursFormatted = String(hours).padStart(2, '0');

    return `${hoursFormatted}:${minutes} ${ampm}`;
}

export function serverDateToBaseDate(date?: Date | string) {
    if (!date) {
        return null;
    }

    const dateObj = new Date(date);

    return {
        year: dateObj.getFullYear(),
        month: dateObj.getMonth() + 1,
        date: dateObj.getDate(),
    };
}

export function baseDateToServerDate(baseDate): Date {
    console.log(baseDate)
    return new Date(baseDate.year, baseDate.month - 1, baseDate.date);
}