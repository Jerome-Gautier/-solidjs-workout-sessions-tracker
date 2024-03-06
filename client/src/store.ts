import { createSignal } from "solid-js";
import { dateItem, workoutTableItem } from "./inteface";

export const [date, setDate] = createSignal<dateItem>({ day: new Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear(), fullMonth: "", monthArray: [] });
export const [monthTable, setMonthTable] = createSignal<any>(undefined);
export const [calendarTable, setCalendarTable] = createSignal<any>(undefined);
export const [currentWorkout, setCurrentWorkout] = createSignal<workoutTableItem | undefined>(undefined);
export const [exercisesList, setExercisesList] = createSignal(["Bench Press"], { equals: false });