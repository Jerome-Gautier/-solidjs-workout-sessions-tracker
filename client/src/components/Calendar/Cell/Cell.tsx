import { Button, createDisclosure, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@hope-ui/solid";
import { createSignal, For } from "solid-js";
import { saveToJson } from "../../../assets/utils";
import { date, monthTable, setDate, setMonthTable } from "../../../store";

import "./styles.css";

export default function Cell(props: any) {
    const [newExercise, setNewExercise] = createSignal({ exercise: "", weight: "0", repetitions: "0", creating: false });
    const [workoutSession, setWorkoutSession] = createSignal(monthTable()[props.dayNumber] || new Array(), { equals: false });

    const { isOpen, onOpen, onClose } = createDisclosure();

    let monthObj = monthTable();


    const handleChange = (e: any) => {
        setNewExercise({ ...newExercise(), [e.target.id]: e.target.value });
    }

    const handleDelete = (index: number) => {
        let newArr = workoutSession();
        newArr.splice(index, index + 1);
        setWorkoutSession(newArr);
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
                <div class={`cells ${props.dayNumber === date().day && "selected"} cell-width`} onclick={() => setDate({ ...date(), day: props.dayNumber })}>
                    <div class="day-number">{props.dayNumber}</div>
                    <div class="session-container">
                        <div>
                            {workoutSession &&
                                <For each={workoutSession()}>{(item: any) =>
                                    <div class="exercise-container">
                                        <div>{item.exercise}</div>
                                        <div>{item.weight}</div>
                                        <div>{item.repetitions}</div>
                                    </div>
                                }</For>
                            }
                        </div>
                        <Button onclick={onOpen} colorScheme="neutral">{workoutSession().length > 0 ? "Modify workout" : "New workout session"}</Button>
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
                                            <div>
                                                <div>
                                                    <Input onchange={handleChange} id="exercise" placeholder="Exercise" />
                                                    <Input onchange={handleChange} placeholder="Weight" id="weight" />
                                                    <Input onchange={handleChange} placeholder="Repetitions" id="repetitions" />
                                                </div>
                                                <Button onclick={handleAddExercise}>Add</Button>
                                                <Button onclick={() => setNewExercise({ exercise: "", weight: "0", repetitions: "0", creating: false })} colorScheme="neutral">Cancel</Button>
                                            </div> :
                                            <Button onclick={() => setNewExercise({ ...newExercise(), creating: true })}>New Exercise</Button>}
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <div class="modal-footer">
                                        <Button onclick={handleSaveSession}>Save</Button>
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