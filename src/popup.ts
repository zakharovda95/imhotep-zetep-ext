class Popup {
  private readonly container: HTMLElement | null = null;
  private readonly zetepUrl: string = 'https://eds.zetep.com/';

  constructor() {
    this.container = document.querySelector('.imhotep-ext') ?? null;
  }

  private get template(): string {
    return `<div class="imhotep-ext-popup">
                <img alt="zetep logo" src="./icons/zetep-logo.svg" />
                <div class="imhotep-ext-popup__text">Перейти на сайт</div>
            </div>`;
  }

  public init(): void {
    this.render();
    this.addListeners();
  }

  private render(): void {
    if (!this.container) return;
    this.container.insertAdjacentHTML('afterbegin', this.template);
  }

  private addListeners(): void {
    if (!this.container) return;

    const popup: HTMLElement | null = this.container.querySelector('.imhotep-ext-popup');
    if (!popup) return;

    popup.addEventListener('click', () => {
      // @ts-ignore
      const chromeObject = chrome;
      if (typeof chromeObject !== 'undefined' && chromeObject.tabs && chromeObject.tabs.create) {
        chromeObject.tabs.create({ url: this.zetepUrl });
      } else window.location.href = this.zetepUrl;
    });
  }
}

document.addEventListener('DOMContentLoaded', (): void => {
  const popup: Popup = new Popup();
  popup.init();

  console.log('popup was loaded');
});
