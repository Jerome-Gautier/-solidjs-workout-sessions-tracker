import { date, setDate, setMonthTable, calendarTable, monthTable, exercisesList, setExercisesList } from "../store";
import { apiUrl } from "./config";
import axios from "axios";

export const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const loadCurrentMonth = (dateObject: { day: number, month: number, year: number }, weekdays: any) => {
    setMonthTable(undefined);
    const month = dateObject.month;
    const year = dateObject.year;
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const dateString = firstDayOfMonth.toLocaleDateString("en-gb", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
    const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);
    const fullMonth = dateString.split(", ")[1].split(' ')[1]
    const fullWeekDay = dateString.split(", ")[0];
    let monthArray = [];
    let currentDay = 1;
    for (let i = 0; i < 42; i++) {
        if ((i < paddingDays) || (i >= (daysInMonth + paddingDays))) {
            monthArray.push({ index: i, dayNumber: null});
        } else {
            monthArray.push({ index: i, dayNumber: currentDay, fullWeekDay });
            currentDay++;
        }
    }
    const str: string = year.toString();
    setDate({ ...date(), fullMonth, monthArray });
    let obj = calendarTable();
    if (!obj[str]) obj[year] = {};
    if (!obj[str][fullMonth]) obj[str][fullMonth] = {}

    setMonthTable(obj[str][fullMonth] || undefined);
    let arr = Object.keys(monthTable());
    let newArr = exercisesList();
    arr.forEach(str => {
        let table = monthTable()[str]
        table.forEach((obj: any) => {
            if (!exercisesList().includes(obj.exercise)) {
                newArr.push(obj.exercise);
            }
        });
    });
    setExercisesList(newArr);    
}

export const getJson = async () => {
    try {
        const response = await axios({
            url: `${apiUrl}`,
            method: "GET",
        });
        return response;
    } catch (err) {
        return err;
    }
}

export const saveToJson = async (newMonthObj: object, year: number, fullMonth: string, dayNumber: number) => {
    let newTable = calendarTable();
    if (!newTable[year]) newTable[year] = {};
    newTable[year][fullMonth] = newMonthObj;
    try {
        const response = await axios({
            url: `${apiUrl}/save_calendar`,
            method: "POST",
            data: {
                obj: newTable,
            }
        });
        if (response.data.status === "OK") {
            return response.status;
        }
        throw { error: response.data.status };
    } catch (err) {
        return err;
    }
}

