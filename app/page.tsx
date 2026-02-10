"use client";

import { useMemo, useState } from "react";
import { defaultSchedule, type DayKey, type DaySchedule } from "@/lib/plan";
import type { FocusArea, Workout } from "@/lib/workouts";
import { workoutLibrary } from "@/lib/workouts";
import { countFocus, formatMinutes, sumDuration } from "@/lib/utils";

const focusPalette: Record<FocusArea, string> = {
  Strength: "bg-primary-500 text-white",
  Cardio: "bg-rose-500 text-white",
  Mobility: "bg-emerald-500 text-white",
  Recovery: "bg-sky-500 text-white",
  Mindfulness: "bg-purple-500 text-white"
};

const dayOrder: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type FocusToggle = FocusArea | "All";

const focusOptions: FocusToggle[] = ["All", "Strength", "Cardio", "Mobility", "Recovery", "Mindfulness"];

const energyColors: Record<DaySchedule["energy"], string> = {
  High: "text-emerald-400",
  Moderate: "text-amber-400",
  Low: "text-sky-300"
};

const anchorColors: Record<DaySchedule["anchor"], string> = {
  AM: "bg-emerald-50 text-emerald-600",
  Midday: "bg-amber-50 text-amber-600",
  PM: "bg-indigo-50 text-indigo-600"
};

const difficultyColors: Record<Workout["difficulty"], string> = {
  Beginner: "bg-emerald-500/20 text-emerald-200",
  Intermediate: "bg-amber-500/20 text-amber-100",
  Advanced: "bg-rose-500/20 text-rose-100"
};

export default function Home() {
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultSchedule);
  const [activeDay, setActiveDay] = useState<DayKey>("Mon");
  const [focusFilter, setFocusFilter] = useState<FocusToggle>("All");
  const [energyGoal, setEnergyGoal] = useState<"Balanced" | "Push" | "Recovery">("Balanced");

  const currentDay = schedule.find((day) => day.day === activeDay) ?? schedule[0];

  const visibleLibrary = useMemo(() => {
    if (focusFilter === "All") {
      return workoutLibrary;
    }
    return workoutLibrary.filter((workout) => workout.focus.includes(focusFilter));
  }, [focusFilter]);

  const focusSummary = useMemo(() => countFocus(schedule), [schedule]);
  const totalMinutes = useMemo(() => sumDuration(schedule), [schedule]);

  const addWorkoutToDay = (dayId: string, workout: Workout) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              isRestDay: false,
              workouts: day.workouts.some((item) => item.id === workout.id)
                ? day.workouts
                : [...day.workouts, workout]
            }
          : day
      )
    );
  };

  const removeWorkoutFromDay = (dayId: string, workoutId: string) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              workouts: day.workouts.filter((workout) => workout.id !== workoutId),
              isRestDay: day.workouts.filter((workout) => workout.id !== workoutId).length === 0
            }
          : day
      )
    );
  };

  const toggleRest = (dayId: string) => {
    setSchedule((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              isRestDay: !day.isRestDay,
              workouts: !day.isRestDay ? [] : day.workouts
            }
          : day
      )
    );
  };

  const shiftWeek = (direction: "forward" | "backward") => {
    setSchedule((prev) =>
      prev.map((day) => {
        const focusPool: DaySchedule["focus"][] =
          energyGoal === "Recovery"
            ? ["Mobility", "Recovery"]
            : energyGoal === "Push"
            ? ["Strength", "Cardio"]
            : ["Strength", "Cardio", "Mobility"];
        const currentIndex = focusPool.indexOf(day.focus);
        const baseIndex = currentIndex === -1 ? 0 : currentIndex;
        const offset = direction === "forward" ? 1 : -1;
        const nextFocus = focusPool[(baseIndex + offset + focusPool.length) % focusPool.length];
        return {
          ...day,
          focus: nextFocus
        };
      })
    );
  };

  const currentDayDuration = currentDay.workouts.reduce(
    (total, workout) => total + workout.duration,
    0
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 pb-32">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
        <header className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-6 shadow-xl ring-1 ring-white/5 fade-in">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm uppercase tracking-wide text-slate-400">Agentic Fitness</div>
              <h1 className="font-display mt-1 text-3xl text-white">Weekly Workout Planner</h1>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => shiftWeek("backward")}
                className="glass-card flex h-10 w-10 items-center justify-center rounded-full text-slate-200 transition hover:scale-105"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => shiftWeek("forward")}
                className="glass-card flex h-10 w-10 items-center justify-center rounded-full text-slate-200 transition hover:scale-105"
              >
                →
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Curate your training focus for the week, swap workouts on the fly, and keep tabs on total training time,
            intensity, and recovery windows. Optimized for mobile, responsive everywhere.
          </p>
          <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1 text-sm">
            {focusOptions.map((focus) => (
              <button
                key={focus}
                type="button"
                onClick={() => setFocusFilter(focus)}
                className={`rounded-full border border-white/10 px-4 py-1 font-medium transition ${
                  focusFilter === focus ? "bg-white text-slate-900 shadow" : "text-slate-300 hover:bg-white/10"
                }`}
              >
                {focus}
              </button>
            ))}
          </div>
        </header>

        <section className="glass-card rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-white">Weekly Focus</h2>
            <div className="flex gap-2 text-xs">
              {(["Balanced", "Push", "Recovery"] as const).map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setEnergyGoal(preset)}
                  className={`rounded-full px-3 py-1 font-medium transition ${
                    energyGoal === preset ? "bg-white text-slate-900" : "bg-white/10 text-slate-300"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/10">
              <span className="text-xs uppercase tracking-wide text-slate-400">Scheduled Time</span>
              <p className="mt-2 text-2xl font-semibold text-white">{formatMinutes(totalMinutes)}</p>
              <p className="mt-1 text-xs text-slate-400">Target: 5h weekly</p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/10">
              <span className="text-xs uppercase tracking-wide text-slate-400">Focus Split</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(focusSummary).map(([focus, count]) => (
                  <div key={focus} className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200">
                    <span className="h-2 w-2 rounded-full bg-primary-400" />
                    <span className="font-medium">{focus}</span>
                    <span className="text-slate-400">×{count}</span>
                  </div>
                ))}
                {!Object.keys(focusSummary).length && <span className="text-slate-500">No workouts scheduled</span>}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/10">
              <span className="text-xs uppercase tracking-wide text-slate-400">Energy Strategy</span>
              <p className="mt-2 text-lg font-semibold text-slate-100">{energyGoal}</p>
              <p className="mt-1 text-xs text-slate-400">Auto-adjusts focus when shifting the schedule.</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="glass-card rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-white">Schedule</h2>
              <span className="text-xs uppercase tracking-wide text-slate-400">Week View</span>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
              {schedule.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setActiveDay(day.day)}
                  className={`flex min-w-[84px] flex-col items-center rounded-xl border px-3 py-2 text-sm transition ${
                    activeDay === day.day
                      ? "border-white/60 bg-white text-slate-900 shadow-lg"
                      : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20"
                  }`}
                >
                  <span className="font-semibold">{day.day}</span>
                  <span className={`text-xs font-medium ${energyColors[day.energy]}`}>{day.focus}</span>
                </button>
              ))}
            </div>

            <article className="mt-5 rounded-3xl bg-slate-900/70 p-5 ring-1 ring-white/10 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-2xl text-white">{currentDay.day}</h3>
                  <p className="text-sm text-slate-400">{currentDay.notes || "Add notes to shape the intent of this day."}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${anchorColors[currentDay.anchor]}`}>
                    Anchor • {currentDay.anchor}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleRest(currentDay.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      currentDay.isRestDay ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-200 hover:bg-white/20"
                    }`}
                  >
                    {currentDay.isRestDay ? "Mark Active" : "Mark Rest"}
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className={`rounded-full px-3 py-1 font-semibold ${energyColors[currentDay.energy]}`}>
                  Energy: {currentDay.energy}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-slate-200">
                  Duration: {formatMinutes(currentDayDuration)}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-slate-200">
                  Sessions: {currentDay.workouts.length}
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                {currentDay.isRestDay && (
                  <div className="rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                    Rest day locked in. Use guided recovery or mindful mobility to stay loose.
                  </div>
                )}

                {!currentDay.isRestDay &&
                  (currentDay.workouts.length ? (
                    currentDay.workouts.map((workout) => (
                      <WorkoutCard
                        key={workout.id}
                        workout={workout}
                        onRemove={() => removeWorkoutFromDay(currentDay.id, workout.id)}
                      />
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/15 p-5 text-center text-sm text-slate-400">
                      Nothing planned yet. Swipe through the library below to add a session.
                    </div>
                  ))}
              </div>
            </article>
          </div>

          <aside className="glass-card flex flex-col gap-5 rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-white">Library</h2>
              <span className="text-xs text-slate-400">{visibleLibrary.length} options</span>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto">
              {visibleLibrary.map((workout) => (
                <button
                  key={workout.id}
                  type="button"
                  onClick={() => addWorkoutToDay(currentDay.id, workout)}
                  className="group rounded-3xl bg-slate-900/60 p-4 text-left shadow-sm ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-white/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{workout.name}</h3>
                      <p className="mt-1 text-xs text-slate-400">{workout.description}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${difficultyColors[workout.difficulty]}`}>
                      {workout.difficulty}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
                      {formatMinutes(workout.duration)}
                    </span>
                    {workout.calories ? (
                      <span className="rounded-full bg-white/10 px-3 py-1 text-slate-200">
                        ~{workout.calories} kcal
                      </span>
                    ) : null}
                    {workout.focus.map((focus) => (
                      <span key={`${workout.id}-${focus}`} className={`rounded-full px-3 py-1 text-xs font-medium ${focusPalette[focus]}`}>
                        {focus}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-slate-400">
                    {workout.equipment.map((tool) => (
                      <span key={`${workout.id}-${tool}`} className="rounded-full border border-white/10 px-2 py-1">
                        {tool}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </aside>
        </section>

        <section className="glass-card rounded-3xl p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-xl text-white">Weekly Timeline</h2>
              <p className="text-sm text-slate-400">
                Keep tabs on daily intent. Long press a day on mobile to quickly reorder focus priorities.
              </p>
            </div>
            <div className="flex gap-2">
              {dayOrder.map((day) => {
                const details = schedule.find((item) => item.day === day);
                if (!details) return null;
                const plannedMinutes = details.workouts.reduce(
                  (total, workout) => total + workout.duration,
                  0
                );
                return (
                  <div
                    key={day}
                    className={`flex min-w-[68px] flex-col items-center rounded-2xl px-3 py-2 text-xs ${
                      day === activeDay ? "bg-white text-slate-900" : "bg-white/5 text-slate-300"
                    }`}
                  >
                    <span className="font-semibold">{day}</span>
                    <span className="mt-1 rounded-full bg-slate-900/40 px-2 py-0.5 text-[10px]">
                      {details.focus}
                    </span>
                    <span className="mt-1 text-[10px]">
                      {plannedMinutes ? formatMinutes(plannedMinutes) : "Rest"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

type WorkoutCardProps = {
  workout: Workout;
  onRemove: () => void;
};

function WorkoutCard({ workout, onRemove }: WorkoutCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white/5 p-5 ring-1 ring-white/10 transition hover:ring-white/25">
      <div className="absolute right-4 top-4">
        <button
          type="button"
          onClick={onRemove}
          className="hidden h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[18px] text-slate-100 transition hover:bg-rose-500/80 hover:text-white group-hover:flex"
          aria-label={`Remove ${workout.name}`}
        >
          ×
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-lg font-semibold text-white">{workout.name}</h4>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">{workout.description}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${focusPalette[workout.focus[0]]}`}>
            {workout.focus[0]}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200">
          <span className="rounded-full bg-white/10 px-3 py-1">{formatMinutes(workout.duration)}</span>
          <span className="rounded-full bg-white/10 px-3 py-1">{workout.difficulty}</span>
          {workout.calories ? (
            <span className="rounded-full bg-white/10 px-3 py-1">~{workout.calories} kcal</span>
          ) : null}
          {workout.focus.slice(1).map((tag) => (
            <span key={`${workout.id}-${tag}`} className={`rounded-full px-3 py-1 text-xs font-medium ${focusPalette[tag]}`}>
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-wide text-slate-400">
          {workout.equipment.map((tool) => (
            <span key={`${workout.id}-${tool}`} className="rounded-full border border-white/15 px-2 py-1">
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
