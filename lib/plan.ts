import type { Workout } from "./workouts";
import { workoutLibrary } from "./workouts";

export type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type DaySchedule = {
  id: string;
  day: DayKey;
  focus: "Strength" | "Cardio" | "Mobility" | "Recovery";
  energy: "High" | "Moderate" | "Low";
  anchor: "AM" | "Midday" | "PM";
  workouts: Workout[];
  notes: string;
  isRestDay?: boolean;
};

const pickWorkout = (id: string) => workoutLibrary.find((workout) => workout.id === id)!;

export const defaultSchedule: DaySchedule[] = [
  {
    id: "mon",
    day: "Mon",
    focus: "Strength",
    energy: "High",
    anchor: "AM",
    workouts: [pickWorkout("w2"), pickWorkout("w7")],
    notes: "Emphasize eccentric tempo; track pushing numbers."
  },
  {
    id: "tue",
    day: "Tue",
    focus: "Cardio",
    energy: "Moderate",
    anchor: "PM",
    workouts: [pickWorkout("w3")],
    notes: "Keep HR in tempo zone; post-run mobility for calves."
  },
  {
    id: "wed",
    day: "Wed",
    focus: "Mobility",
    energy: "Low",
    anchor: "Midday",
    workouts: [pickWorkout("w4"), pickWorkout("w8")],
    notes: "Perfect day for restorative flow and breath work."
  },
  {
    id: "thu",
    day: "Thu",
    focus: "Strength",
    energy: "High",
    anchor: "AM",
    workouts: [pickWorkout("w5")],
    notes: "Focus on explosive intent; video KB swing technique."
  },
  {
    id: "fri",
    day: "Fri",
    focus: "Cardio",
    energy: "Moderate",
    anchor: "AM",
    workouts: [pickWorkout("w6")],
    notes: "Zone 2 ride; sit tall and keep cadence above 90."
  },
  {
    id: "sat",
    day: "Sat",
    focus: "Strength",
    energy: "Moderate",
    anchor: "Midday",
    workouts: [pickWorkout("w1")],
    notes: "Finish with optional core session if energy allows."
  },
  {
    id: "sun",
    day: "Sun",
    focus: "Recovery",
    energy: "Low",
    anchor: "PM",
    workouts: [],
    notes: "Hydrate, long walk outside, stretch hamstrings.",
    isRestDay: true
  }
];
