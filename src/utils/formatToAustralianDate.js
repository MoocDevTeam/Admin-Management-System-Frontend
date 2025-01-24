export default function formatToAustralianDate(isoDateString) {
    const date = new Date(isoDateString);
    if (isNaN(date.getTime())) {
        return "Invalid date"; 
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
