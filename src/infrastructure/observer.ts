import { observerHandlerCallback } from './types';

class Observer {
  private readonly root: Node;
  private readonly PARAMS: MutationObserverInit = { childList: true, subtree: true };

  constructor(root: Node) {
    this.root = root;
    if (!this.root) throw new Error('[observer] Не передан корневой узел для отслеживания.');
  }

  public observe(
    selector: string,
    addedCb: observerHandlerCallback,
    removedCb: observerHandlerCallback,
  ): void {
    if (!addedCb || !addedCb || !removedCb) return;

    const observer: MutationObserver = new MutationObserver((mutations: MutationRecord[]) => {
      for (const mutation of mutations) {
        const callbackWasCalled: boolean = this.callIfNodeExists(
          mutation.addedNodes,
          selector,
          addedCb,
        );
        if (callbackWasCalled) return;
        this.callIfNodeExists(mutation.removedNodes, selector, removedCb);
      }
    });

    observer.observe(this.root, this.PARAMS);
  }

  private callIfNodeExists(
    nodes: NodeList,
    selector: string,
    cb: observerHandlerCallback,
  ): boolean {
    if (!nodes.length || !cb || !selector) return false;

    for (const node of Array.from(nodes)) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el: HTMLElement = node as HTMLElement;
        const exists = Boolean(el.matches(`${selector}`) || el.querySelector?.(`${selector}`));

        if (exists) {
          cb(node);
          return true;
        }
        return false;
      }
    }
    return false;
  }
}

export default Observer;
