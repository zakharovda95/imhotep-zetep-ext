import Widget from './infrastructure/widget';
import Observer from './infrastructure/observer';

const observer: Observer = new Observer(document.body);
const widget: Widget = new Widget(observer);
widget.init();

console.log('content was loaded');
