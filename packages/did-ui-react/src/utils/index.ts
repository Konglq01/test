import EventEmitter from 'events';

export const eventBus = new EventEmitter();

export const isExtension = () => location.protocol === 'chrome-extension:';
