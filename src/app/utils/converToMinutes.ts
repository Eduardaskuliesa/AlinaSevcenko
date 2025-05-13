export const convertTime = (seconds: number): string => {
  if (!seconds && seconds !== 0) return "N/A";

  const minutes = seconds / 60;

  if (minutes < 60) {
    if (minutes < 1 && minutes > 0) {
      return `${minutes.toFixed(1).replace(/\.0$/, "")}min`;
    }
    return `${Math.floor(minutes)}min`;
  } else {
    const hours = minutes / 60;
    if (hours === Math.floor(hours)) {
      return `${Math.floor(hours)}h`;
    } else {
      return `${hours.toFixed(2).replace(/\.?0+$/, "")}h`;
    }
  }
};
