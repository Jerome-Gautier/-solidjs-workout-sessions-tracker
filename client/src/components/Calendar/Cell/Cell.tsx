import { Button, createDisclosure, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@hope-ui/solid";
import { createSignal, For } from "solid-js";
import { saveToJson } from "../../../assets/utils";
import { date, monthTable, setDate, setMonthTable, exercisesList, setExercisesList } from "../../../store";

import "./styles.css";

export default function Cell(props: any) {
    const [newExercise, setNewExercise] = createSignal({ exercise: "", weight: "0", repetitions: "0", creating: false });
    const [workoutSession, setWorkoutSession] = createSignal(monthTable()[props.dayNumber] || new Array(), { equals: false });
    const [createExercise, setCreateExercise] = createSignal("");

    const { isOpen, onOpen, onClose } = createDisclosure();

    let monthObj = monthTable();

    const handleChangeDate = (e: any) => {
        setDate({ ...date(), day: props.dayNumber });
        e.target.scrollIntoView({ 
            behavior: 'auto',
            block: 'center',
            inline: 'center' 
        });
    }

    const handleChange = (e: any) => {
        setNewExercise({ ...newExercise(), [e.target.id]: e.target.value });
    }

    const handleDelete = (index: number) => {
        let newArr = workoutSession();
        newArr.splice(index, 1);
        setWorkoutSession(newArr);
    }

    const handleCreateExercise = () => {
        let newArr = exercisesList();
        let str = createExercise();
        if (!exercisesList().includes(str)) {
            newArr.push(str);
            setExercisesList(newArr);
        }
        setNewExercise({ ...newExercise(), exercise: str });
        setCreateExercise("");
    }

    const handleAddExercise = () => {
        let newObj = { exercise: newExercise().exercise, weight: parseInt(newExercise().weight), repetitions: newExercise().repetitions };
        let updatedSession = workoutSession();
        if (!monthObj[props.dayNumber]) {
            updatedSession = [newObj];
        } else {
            updatedSession.push(newObj);
        }
        setWorkoutSession(updatedSession);
        monthObj[props.dayNumber] = workoutSession();
        setMonthTable(monthObj);
        setNewExercise({ exercise: "", weight: "0", repetitions: "0", creating: false });
    }

    const handleSaveSession = () => {
        saveToJson(monthTable(), date().year, date().fullMonth, props.dayNumber);
        onClose();
    }

    return (
        <div class="cell-container">
            {props.dayNumber ?
                <div class={`cells ${props.dayNumber === date().day && "selected"} cell-width`} id={props.dayNumber === date().day ? "current-day" : ""} onclick={handleChangeDate}>
                    <div class="day-number">{props.dayNumber}</div>
                    <div class="session-outer-container">
                        <div class="session-inner-container">
                            {workoutSession().length > 0 &&
                            <>
                                <div class="exercise-container">
                                    <div>Exercise</div>
                                    <div>Weight</div>
                                    <div>Reps</div>
                                </div>
                                <For each={workoutSession()}>{(item: any) =>
                                    <div class="exercise-container">
                                        <div><span>{item.exercise}</span></div>
                                        <div>{item.weight}Kg</div>
                                        <div>{item.repetitions}</div>
                                    </div>
                                }</For>
                            </>
                            }
                        </div>
                            <Button class="btn-container" onclick={onOpen} colorScheme="neutral">{workoutSession().length > 0 ? "Modify workout" : "New workout session"}</Button>
                        <Modal opened={isOpen()} onClose={onClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalCloseButton />
                                <ModalHeader>{props.weekDay} {props.dayNumber} {date().fullMonth}</ModalHeader>
                                <ModalBody>
                                    <div class="modal-body">
                                        <For each={workoutSession()}>{(item: any, index) =>
                                            <div class="exercise-container">
                                                <div>{item.exercise}</div>
                                                <div>{item.weight}</div>
                                                <div>{item.repetitions}</div>
                                                <Button onclick={[handleDelete, index()]} size="xs" colorScheme="danger">X</Button>
                                            </div>}
                                        </For>
                                        {newExercise().creating ?
                                            <div class="">
                                                <div class="">
                                                    <div class="inline-flex">
                                                        <select onchange={handleChange} id="exercise" value={newExercise().exercise}>
                                                            <option value=""></option>
                                                            <For each={exercisesList()}>{(str) =>
                                                                <option value={str}>{str}</option>
                                                            }</For>
                                                            <option value="new-exercise">... New exercise</option>
                                                        </select>
                                                        {newExercise().exercise === "new-exercise" &&
                                                            <>
                                                                <div class="horizontal-separation"></div>
                                                                <Input onchange={(e: any) => setCreateExercise(e.target.value)} placeholder="New exercise" id="new-exercise" />
                                                                <div class="horizontal-separation"></div>
                                                                <Button onclick={handleCreateExercise}>Create</Button>
                                                            </>
                                                        }
                                                    </div>
                                                    <div class="vertical-separation"></div>
                                                    <Input onchange={handleChange} placeholder="Weight" id="weight" />
                                                    <div class="vertical-separation"></div>
                                                    <Input onchange={handleChange} placeholder="Repetitions" id="repetitions" />
                                                    <div class="vertical-separation"></div>
                                                </div>
                                                <div class="inline-flex">
                                                    <Button onclick={handleAddExercise}>Add</Button>
                                                    <div class="horizontal-separation"></div>
                                                    <Button onclick={() => setNewExercise({ exercise: "", weight: "0", repetitions: "0", creating: false })} colorScheme="neutral">Cancel</Button>
                                                </div>
                                            </div> :
                                            <Button onclick={() => setNewExercise({ ...newExercise(), creating: true })}>New Exercise</Button>
                                        }
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <div class="modal-footer">
                                        <Button onclick={handleSaveSession}>Save</Button>
                                        <div class="horizontal-separation"></div>
                                        <Button onclick={onClose} colorScheme="neutral">Cancel</Button>
                                    </div>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                </div> :
                <div class="empty-cells cell-width"></div>}
        </div>
    )
}