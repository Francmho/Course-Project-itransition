// import { useTranslation } from "react-i18next";
// // Función para convertir el isoDate de last_login a un formato legible
// export const timeAgo = (isoDate) => {
//     const { t } = useTranslation("global");
//     const seconds = Math.floor((new Date() - new Date(isoDate)) / 1000);
//     const units = [
//         { labelSingular: "time.month", labelPlural: "time.months", divisor: 60 * 60 * 24 * 30 },
//         { labelSingular: "time.day", labelPlural: "time.days", divisor: 60 * 60 * 24 },
//         { labelSingular: "time.hour", labelPlural: "time.hours", divisor: 60 * 60 },
//         { labelSingular: "time.minute", labelPlural: "time.minutes", divisor: 60 }
//     ];
    
//     for (let unit of units) {
//         const value = Math.floor(seconds / unit.divisor);
//         if (value >= 1) return `${value} ${t(value > 1 ? unit.labelPlural : unit.labelSingular)} ${t('time.ago')}`;
//     }
//     return t('time.less_than_a_minute');
// };


// import React from 'react';
// import { useTranslation } from 'react-i18next';
// //import { timeAgo } from '../utils/timeAgo'; // Import the utility function

// const TimeAgo = ({ isoDate }) => {
//     const { t } = useTranslation("global");

//     return (
//         <span>{timeAgo(isoDate, t)}</span>
//     );
// };

// export default imeAgo;
