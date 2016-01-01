import {EventEmitter} from 'events';

export interface AppDispatcher {
  emit(name: 'create', text: string): boolean;
  emit(name: 'complete', id: string): boolean;
  emit(name: 'destroy', id: string): boolean;
  emit(name: 'destroyCompleted'): boolean;
  emit(name: 'toggleCompleteAll'): boolean;
  emit(name: 'undoComplete', id: string): boolean;
  emit(name: 'updateText', target: {id: string; text: string;}): boolean;
  emit(name: string, payload?: any): void;

  on(name: 'create', listener: (text: string) => any): this;
  on(name: 'complete', listener: (id: string) => any): this;
  on(name: 'destroy', listener: (id: string) => any): this;
  on(name: 'destroyCompleted', listener: () => any): this;
  on(name: 'toggleCompleteAll', listener: () => any): this;
  on(name: 'undoComplete', listener: (id: string) => any): this;
  on(name: 'updateText', listener: (target: {id: string; text: string;}) => any): this;
  on(name: string, listener: (payload?: any) => any): void;
}

const AppDispatcher: AppDispatcher = new EventEmitter();

export default AppDispatcher;
