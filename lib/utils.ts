import type { DaySchedule } from "./plan";

export const sumDuration = (schedule: DaySchedule[]) =>
  schedule.reduce((total, day) => {
    const duration = day.workouts.reduce((dayTotal, workout) => dayTotal + workout.duration, 0);
    return total + duration;
  }, 0);

export const countFocus = (schedule: DaySchedule[]) =>
  schedule.reduce<Record<string, number>>((acc, day) => {
    day.workouts.forEach((workout) => {
      workout.focus.forEach((tag) => {
        acc[tag] = (acc[tag] ?? 0) + 1;
      });
    });
    return acc;
  }, {});

export const formatMinutes = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs ? `${hrs}h ${mins}m` : `${mins}m`;
};
