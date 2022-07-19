import { loadCurrentMonth, weekdays } from "../../assets/utils";
import { date, setDate } from "../../store";
import "./styles.css";

export default function Header() {
    const handleMonthIncrease = () => {
        const month = date().month;
        const year = date().year;
        if (date().month < 11) {
            setDate({ ...date(), day: 1, month: month + 1 });
        } else {
            setDate({ ...date(), day: 1, month: 0, year: year + 1 });
        }
        loadCurrentMonth(date(), weekdays);
    }

    const handleMonthDecrease = () => {
        const month = date().month;
        const year = date().year;
        if (date().month > 0) {
            setDate({ ...date(), day: 1, month: month - 1 });
        } else {
            setDate({ ...date(), day: 1, month: 11, year: year - 1 });
        }
        loadCurrentMonth(date(), weekdays);
    }
    return (
        <div class="title-container">
            <h1>My Workout Calendar</h1>
            <div class="month-tools-container">
                <div class="btn-month-decrease btn-month-selector" onclick={handleMonthDecrease}>
                    <div>-</div>
                </div>
                <div class="month-container">{date().fullMonth}</div>
                <div class="year-container">{date().year}</div>
                <div class="btn-month-increase btn-month-selector" onclick={handleMonthIncrease}>
                    <div>+</div>
                </div>
            </div>
        </div>
    )
}