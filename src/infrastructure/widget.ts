import Icon from '../infrastructure/icons';
import {
  TActiveTaskDataOrNull,
  TEventTargetOrNull,
  THtmlElementOrNull,
  TListenersMapCallback,
  TListenersMapCallbackOrNull,
} from './types';
import Observer from '../infrastructure/observer';

class Widget {
  private readonly observer: Observer;
  private readonly activeTaskData: TActiveTaskDataOrNull = null;
  private readonly container: THtmlElementOrNull = null;
  private widgetContextMenu: THtmlElementOrNull = null;
  private listenersMap: WeakMap<HTMLElement, TListenersMapCallback> = new WeakMap();

  constructor(observer: Observer) {
    this.observer = observer;
    if (!this.observer) throw new Error('[widget]: не передана обязательная зависимость observer.');
    this.container = document.querySelector('.appRight') ?? null;
    if (!this.container) throw new Error('[widget]: не найден элемент container.');
  }

  private get widgetTemplate(): string {
    return `<div class="imhotep-ext-active-task">
                <div class="imhotep-ext-active-task__icon">${Icon.time}</div>
                <div class="imhotep-ext-active-task__status --inactive" />
            </div>`;
  }

  private get widgetContextMenuTemplate(): string {
    return `<div class="imhotep-ext-active-task__context-menu">
                <a>${this.activeTaskData?.title ?? 'Нет активной задачи'}</a>             
            </div>`;
  }

  public init() {
    if (!this.container) return;

    this.container.style.position = 'relative';
    this.render(this.widgetTemplate);

    this.setListeners();
    this.observeDOM();
  }

  private render(template: string, position: InsertPosition = 'afterbegin'): void {
    if (!this.container) return;
    this.container.insertAdjacentHTML(position, template);
  }

  private setListeners(): void {
    if (!this.container) return;

    const documentClickHandler = (event: MouseEvent): void => {
      const target: TEventTargetOrNull = event.target;
      if (!target) return;
      this.onDocumentClick(target as HTMLElement);
    };

    const containerClickHandler = (event: MouseEvent): void => {
      const target: TEventTargetOrNull = event.target;
      if (!target) return;
      const isClickInsideOfWidgetContextMenu: boolean = this.checkIsClickInsideOfWidgetContextMenu(
        target as HTMLElement,
      );
      if (isClickInsideOfWidgetContextMenu) event.stopPropagation();
    };

    document.body.addEventListener('click', (event: MouseEvent): void =>
      documentClickHandler(event),
    );
    if (!this.listenersMap.has(document.body))
      this.listenersMap.set(document.body, documentClickHandler);

    this.container.addEventListener('click', (event: MouseEvent): void =>
      containerClickHandler(event),
    );
    if (!this.listenersMap.has(this.container))
      this.listenersMap.set(this.container, containerClickHandler);
  }

  private onDocumentClick(eventTarget: HTMLElement): void {
    const isClickInsideOfWidget = Boolean(eventTarget.closest('.imhotep-ext-active-task'));
    const isClickInsideOfWidgetContextMenu: boolean =
      this.checkIsClickInsideOfWidgetContextMenu(eventTarget);
    const isMenuOpen = Boolean(this.widgetContextMenu);

    if (isClickInsideOfWidget) {
      if (isMenuOpen) {
        if (isClickInsideOfWidgetContextMenu) return;
        else this.closeWidgetContextMenu();
      } else this.openWidgetContextMenu();
    } else this.closeWidgetContextMenu();
  }

  private observeDOM(): void {
    const onAdded = (node: Node): void => {
      console.log('Окно с таской открыто', node);
    };

    const onRemoved = (node: Node): void => {
      const documentClickHandler: TListenersMapCallbackOrNull =
        this.listenersMap.get(document.body) ?? null;
      if (documentClickHandler) {
        document.body.removeEventListener('click', documentClickHandler);
        this.listenersMap.delete(document.body);
      }

      if (!this.container) return;
      const containerClickHandler: TListenersMapCallbackOrNull =
        this.listenersMap.get(this.container) ?? null;
      if (containerClickHandler) {
        this.container.removeEventListener('click', containerClickHandler);
        this.listenersMap.delete(this.container);
      }
      console.log('Окно с таской закрыто', node);
    };

    this.observer.observe('[app-issue-form]', onAdded, onRemoved);
  }

  private openWidgetContextMenu(): void {
    if (!this.container || this.widgetContextMenu) return;
    this.render(this.widgetContextMenuTemplate, 'beforeend');
    this.widgetContextMenu =
      this.container.querySelector('.imhotep-ext-active-task__context-menu') ?? null;
  }

  private closeWidgetContextMenu(): void {
    if (!this.container || !this.widgetContextMenu) return;
    this.container.removeChild(this.widgetContextMenu);
    this.widgetContextMenu = null;
  }

  private checkIsClickInsideOfWidgetContextMenu(target: HTMLElement): boolean {
    return Boolean(target && target.closest('.imhotep-ext-active-task__context-menu'));
  }
}

export default Widget;
