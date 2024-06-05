import { For, Show, onMount } from "solid-js";
import { loadCurrentMonth, weekdays } from "../../assets/utils";
import { date, monthTable } from "../../store";
import Cell from "./Cell/Cell";

import "./styles.css";

export default function Calendar() {
    loadCurrentMonth(date(), weekdays);

    onMount(() => {
        let element = document.getElementById("current-day");
        if (element) {
            element.scrollIntoView({ 
                behavior: 'auto',
                block: 'center',
                inline: 'center' 
            });
        }
    })

    return (
        <div class="calendar-outer-container">
            <div class="weekdays-container">
                <For each={weekdays}>{(weekday: string) =>
                    <div class="fulldays-cells">{weekday}</div>
                }</For>
                <Show when={monthTable()}>
                    <For each={date().monthArray}>{(item: any) =>
                        <Cell dayNumber={item.dayNumber} weekDay={item.fullWeekDay} />
                    }</For>
                </Show>
            </div>
        </div>
    )
}