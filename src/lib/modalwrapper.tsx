import h from "vhtml";
import { createRawSnippet, mount, unmount, type Component, type Snippet } from "svelte";
import { writable } from "svelte/store";
import Modal from "$lib/components/Modal.svelte";
import ActionButton from "$lib/components/ActionButton.svelte";

export interface ModalButton {
    name: string;
    onClick: () => void | Promise<void>;
    /**
     * Whether this button is an action button
     *
     * Action buttons prevent the modal from being closed while their promise is running
     *
     * @default false
     */
    useAction?: boolean;
}

export interface PromptButton {
    name: string;
    onClick: () => Promise<void>;
}

function createJSXSnippet(markup: string, setup?: (element: Element) => void | (() => void)): Snippet {
    return createRawSnippet(() => {
        return {
            render() {
                return markup;
            },
            setup
        };
    });
}

/**
 * Creates a simple message box modal
 *
 * @param content the content
 * @param title the title (or none)
 * @returns a promise that resolves when the modal is closed
 */
export function createMsgBox(content: string, title?: string): Promise<void> {
    return new Promise<void>((resolve) => createModalHTML(content, [], title, resolve));
}

/**
 * Creates a prompting message box modal
 *
 * @param content the content
 * @param buttons the buttons
 * @param title the title (or none)
 * @returns a promise that resolves when the modal is closed with the button name or undefined if an action button was used
 */
export function createPromptMsgBox(
    content: string,
    buttons: (PromptButton | string)[],
    title?: string
): Promise<string | undefined> {
    if (!buttons || buttons.length === 0) {
        throw new Error("At least one button must be specified");
    }
    return new Promise<string | undefined>((resolve) => {
        function buildRegular(btn: string): ModalButton {
            return {
                name: btn,
                useAction: false,
                onClick() {
                    destroyModal().then(() => {
                        resolve(btn.trim().toLowerCase().replace(/\s+/g, "_"));
                    });
                }
            };
        }

        function buildAction(btn: PromptButton): ModalButton {
            return {
                name: btn.name,
                useAction: true,
                async onClick() {
                    await btn.onClick();
                    await destroyModal();
                    resolve(undefined);
                }
            };
        }

        function buildButtons(): ModalButton[] {
            return buttons.map((btn) => {
                if (typeof btn === "string") {
                    return buildRegular(btn);
                } else {
                    return buildAction(btn);
                }
            });
        }

        const destroyModal = createModalHTML(content, buildButtons(), title);
    });
}

/**
 * Creates a callback driven modal component from HTML content
 *
 * If no `onClose` callback is specified, the modal won't be closable
 *
 * Additional buttons must manually destroy the modal via the returned function
 *
 * @param content the content
 * @param buttons the buttons
 * @param title the tile (or none)
 * @param onClose the callback for when the modal is closed
 * @param context the Svelte context to provide to the modal
 * @returns a function that destroys the modal
 */
export function createModalHTML(
    content: string | Node,
    buttons: ModalButton[],
    title?: string,
    onClose?: () => void,
    context?: Record<any, any>
): () => Promise<void> {
    return createModal(
        createJSXSnippet(<div style="display: contents;">{content}</div>),
        buttons,
        title,
        onClose,
        context
    );
}

/**
 * Creates a callback driven modal component from a Svelte component
 *
 * If no `onClose` callback is specified, the modal won't be closable
 *
 * Additional buttons must manually destroy the modal via the returned function
 *
 * @param component the Svelte component
 * @param compProps the props to pass to the component
 * @param buttons the buttons
 * @param title the tile (or none)
 * @param onClose the callback for when the modal is closed
 * @param context the Svelte context to provide to the modal and component
 * @returns a function that destroys the modal
 */
export function createModalComponent(
    component: Component,
    compProps: Record<string, any>,
    buttons: ModalButton[],
    title?: string,
    onClose?: () => void,
    context?: Record<any, any>
) {
    let snippet = createJSXSnippet(<div></div>, (element) => {
        const instance = mount(component, {
            props: compProps,
            target: element,
            context: context ? new Map(Object.entries(context)) : undefined
        });
        return () => unmount(instance);
    });
    return createModal(snippet, buttons, title, onClose, context);
}

/**
 * Creates a callback driven modal component from a Svelte snippet
 *
 * If no `onClose` callback is specified, the modal won't be closable
 *
 * Additional buttons must manually destroy the modal via the returned function
 *
 * @param content the content
 * @param buttons the buttons
 * @param title the tile
 * @param onClose the callback for when the modal is closed
 * @param context the Svelte context to provide to the modal
 * @returns a function that destroys the modal
 */
export function createModal(
    content: Snippet,
    buttons: ModalButton[],
    title?: string,
    onClose?: () => void,
    context?: Record<any, any>
): () => Promise<void> {
    const mountPoint = document.createElement("div");
    let instance: Record<string, any>;
    let allowClose = writable<boolean>(!!onClose);

    async function cleanup() {
        onClose?.();
        await unmount(instance, {
            outro: true
        });
        if (document.body.contains(mountPoint)) {
            document.body.removeChild(mountPoint);
        }
    }

    function buildButtons() {
        function setup(element: Element) {
            const listeners: [Element, () => void][] = [];
            const actionButtons: Record<string, any>[] = [];

            function buildAction(index: number, btn: ModalButton) {
                const mnt = element.querySelector(`#modal-btn-${index}`) as Element;
                const aInstance = mount(ActionButton, {
                    props: {
                        label: btn.name,
                        async action() {
                            allowClose.set(false);
                            try {
                                await btn.onClick();
                            } finally {
                                allowClose.set(!!onClose);
                            }
                        }
                    },
                    target: mnt
                });
                actionButtons.push(aInstance);
            }

            function buildRegular(index: number, btn: ModalButton) {
                const listener = () => btn.onClick();
                const b = element.querySelector(`#modal-btn-${index}`) as Element;
                b.addEventListener("click", listener);
                listeners.push([b, listener]);
            }

            for (const [index, btn] of buttons.entries()) {
                if (btn.useAction) {
                    buildAction(index, btn);
                } else {
                    buildRegular(index, btn);
                }
            }

            return () => {
                for (const [b, listener] of listeners) {
                    b?.removeEventListener("click", listener);
                }
                for (const mnt of actionButtons) {
                    unmount(mnt);
                }
            };
        }

        return createJSXSnippet(
            <div style="display: contents;">
                {buttons.map((btn, index) => {
                    const id = `modal-btn-${index}`;
                    return !btn.useAction ? (
                        <button id={id}>{btn.name}</button>
                    ) : (
                        <div id={id} style="display: contents;"></div>
                    );
                })}
            </div>,
            setup
        );
    }

    instance = mount(Modal, {
        props: {
            title,
            allowClose,
            content,
            buttons: buildButtons(),
            onClose: () => cleanup()
        },
        context: context ? new Map(Object.entries(context)) : undefined,
        target: mountPoint
    });

    document.body.appendChild(mountPoint);
    return cleanup;
}
