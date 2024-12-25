// Función para convertir el isoDate de last_login a un formato legible
export const timeAgo = (isoDate) => {
    const seconds = Math.floor((new Date() - new Date(isoDate)) / 1000);
    const units = [
        { label: "month", divisor: 60 * 60 * 24 * 30 },
        { label: "day", divisor: 60 * 60 * 24 },
        { label: "hour", divisor: 60 * 60 },
        { label: "minute", divisor: 60 }
    ];
    
    for (let unit of units) {
        const value = Math.floor(seconds / unit.divisor);
        if (value >= 1) return `${value} ${unit.label}${value > 1 ? "s" : ""} ago`;
    }
    return "less than a minute ago";
    };