import { createEffect, createSignal, onCleanup } from "solid-js";

import "./styles.css";

export default function Topbar() {
    const [isOpen, setIsOpen] = createSignal(false);

    const focusableElements = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1']";

    let modal: any;

    createEffect(() => {
        const originalFocusedElement = document.activeElement;
        if (isOpen()) {
            const modalFocusableElements = modal.querySelectorAll(focusableElements);
            const firstFocusableElement = modalFocusableElements?.[0];
            const lastFocusableElement = modalFocusableElements?.[modalFocusableElements.length - 1];

            const focusTrap = (e: any) => {
                const { key, code, shiftKey } = e;
                const isTabPressed = (key || code) === "Tab";
                const isEscapePressed = (key || code) === "Escape";
                if (!isTabPressed && !isEscapePressed) return;
                if (isEscapePressed) return setIsOpen(false);
                if (shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement?.focus();
                        e.preventDefault();
                    }
                } else if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement?.focus();
                    e.preventDefault();
                }
            }
            document.addEventListener("keydown", focusTrap);
            firstFocusableElement?.focus();
            onCleanup(() => {
                originalFocusedElement?.focus();
            });
        }
    });

    const handleOpenModal = () => {
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
    }

    return (
        <>
            <div class="topbar-container">
                <div class="inner-container">
                    <button class="modal-btn" onclick={handleOpenModal}>Tracker</button>
                </div>
            </div>
            {isOpen() && (
                <>
                    <div role="presentation" class="modal-backdrop" onClick={handleCloseModal} onKeyPress={handleCloseModal}></div>
                    <div role="dialog" class="modal" ref={modal}>
                        <div class="modal-body">Modal body</div>
                    </div>
                </>
            )}
        </>
        
    )
}