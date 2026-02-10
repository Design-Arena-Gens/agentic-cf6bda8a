export type FocusArea = "Strength" | "Cardio" | "Mobility" | "Recovery" | "Mindfulness";

export type Equipment =
  | "Bodyweight"
  | "Dumbbells"
  | "Kettlebell"
  | "Bands"
  | "Bike"
  | "Treadmill"
  | "Mat";

export type Workout = {
  id: string;
  name: string;
  focus: FocusArea[];
  duration: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  equipment: Equipment[];
  description: string;
  calories?: number;
};

export const workoutLibrary: Workout[] = [
  {
    id: "w1",
    name: "Full-Body Circuit",
    focus: ["Strength", "Cardio"],
    duration: 35,
    difficulty: "Intermediate",
    equipment: ["Bodyweight"],
    description: "Rotational bodyweight circuit with compound moves and active recovery blocks.",
    calories: 290
  },
  {
    id: "w2",
    name: "Strength Upper Split",
    focus: ["Strength"],
    duration: 45,
    difficulty: "Intermediate",
    equipment: ["Dumbbells"],
    description: "Push/pull supersets with tempo work and accessory isolation finishers.",
    calories: 360
  },
  {
    id: "w3",
    name: "Interval Run",
    focus: ["Cardio"],
    duration: 30,
    difficulty: "Beginner",
    equipment: ["Treadmill"],
    description: "5k based run with alternating base, tempo, and threshold intervals.",
    calories: 310
  },
  {
    id: "w4",
    name: "Mobility Flow",
    focus: ["Mobility", "Recovery"],
    duration: 25,
    difficulty: "Beginner",
    equipment: ["Mat"],
    description: "Breath-led mobility flow to improve thoracic rotation and hip stability."
  },
  {
    id: "w5",
    name: "Lower Body Power",
    focus: ["Strength"],
    duration: 50,
    difficulty: "Advanced",
    equipment: ["Kettlebell", "Bands"],
    description: "Contrast training session with KB swings, plyo lunges, and isometric holds.",
    calories: 420
  },
  {
    id: "w6",
    name: "Low-Impact Conditioning",
    focus: ["Cardio", "Mobility"],
    duration: 40,
    difficulty: "Beginner",
    equipment: ["Bike"],
    description: "Zone 2 conditioning ride paired with mobility resets every 8 minutes.",
    calories: 280
  },
  {
    id: "w7",
    name: "Core + Stability",
    focus: ["Mobility", "Strength"],
    duration: 20,
    difficulty: "Beginner",
    equipment: ["Bodyweight", "Bands"],
    description: "Core strength and anti-rotation series with balance drills."
  },
  {
    id: "w8",
    name: "Guided Recovery",
    focus: ["Recovery", "Mindfulness"],
    duration: 18,
    difficulty: "Beginner",
    equipment: ["Mat"],
    description: "Box breathing, guided stretch holds, and low-impact tissue release."
  }
];
