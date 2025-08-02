export type THtmlElementOrNull = HTMLElement | null;
export type TEventTargetOrNull = EventTarget | null;
export type TListenersMapCallback = (event: MouseEvent) => void;
export type TObserverHandlerCallback = (node: Node) => void;
export type TListenersMapCallbackOrNull = TListenersMapCallback | null;
export type TActiveTaskData = { title: string | null; url: string | null };
export type TActiveTaskDataOrNull = TActiveTaskData | null;
