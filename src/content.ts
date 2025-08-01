import Icon from './infrastructure/icons';
import { eventTargetOrNull, htmlElementOrNull } from './infrastructure/types';

class ActiveTaskWidget {
  private readonly container: htmlElementOrNull = null;
  private widget: htmlElementOrNull = null;
  private widgetContextMenu: htmlElementOrNull = null;

  constructor() {
    this.container = document.querySelector('.appRight') ?? null;
  }

  private get widgetTemplate(): string {
    return `<div class="imhotep-ext-active-task">
                <div class="imhotep-ext-active-task__icon">${Icon.time}</div>
                <div class="imhotep-ext-active-task__status --inactive" />
            </div>`;
  }

  private get widgetContextMenuTemplate(): string {
    return `<div class="imhotep-ext-active-task__context-menu">
                Тут отображается активная задача!                
            </div>`;
  }

  public init() {
    if (!this.container) return;

    this.container.style.position = 'relative';
    this.render(this.widgetTemplate);
    this.widget = this.container.querySelector('.imhotep-ext-active-task') ?? null;

    this.setListeners();
  }

  private render(template: string, position: InsertPosition = 'afterbegin'): void {
    if (!this.container) return;
    this.container.insertAdjacentHTML(position, template);
  }

  private setListeners(): void {
    if (!this.container) return;

    document.addEventListener('click', (event: MouseEvent) => {
      event.stopPropagation();
      const target: eventTargetOrNull = event.target;
      if (!target) return;
      this.onDocumentClick(target as HTMLElement);
    });

    this.container.addEventListener('click', (event: MouseEvent) => {
      const target: eventTargetOrNull = event.target;
      if (!target) return;
      const isClickInsideOfWidgetContextMenu: boolean = this.getIsClickInsideOfWidgetContextMenu(
        target as HTMLElement,
      );
      if (isClickInsideOfWidgetContextMenu) event.stopPropagation();
    });
  }

  private onDocumentClick(eventTarget: HTMLElement): void {
    const isClickInsideOfWidget = Boolean(eventTarget.closest('.imhotep-ext-active-task'));
    const isClickInsideOfWidgetContextMenu: boolean =
      this.getIsClickInsideOfWidgetContextMenu(eventTarget);
    const isMenuOpen = Boolean(this.widgetContextMenu);

    if (isClickInsideOfWidget) {
      if (isMenuOpen) {
        if (isClickInsideOfWidgetContextMenu) return;
        else this.closeWidgetContextMenu();
      } else this.openWidgetContextMenu();
    } else this.closeWidgetContextMenu();
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

  private getIsClickInsideOfWidgetContextMenu(target: HTMLElement): boolean {
    return Boolean(target && target.closest('.imhotep-ext-active-task__context-menu'));
  }
}

const activeTaskWidget: ActiveTaskWidget = new ActiveTaskWidget();
activeTaskWidget.init();

console.log('content was loaded');
