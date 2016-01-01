import AppDispatcher from 'todo-dispatcher';

namespace TodoStore {

  const todos: {[id: string]: Todo} = {};
  const changeListeners: (() => void)[] = [];

  export function areAllComplete(): boolean {
    for (var id in todos) {
      if (!todos[id].complete) {
        return false;
      }
    }
    return true;
  }

  export function getAll(): {[id: string]: Todo} {
    return todos;
  }

  function emitChange(): void {
    changeListeners.forEach((listener) => listener());
  }

  export function addChangeListener(listener: () => void): void {
    changeListeners.push(listener);
  }

  export function removeChangeListener(listener: () => void): void {
    const index = changeListeners.indexOf(listener);
    if (index >= 0) {
      changeListeners.splice(index, 1);
    }
  }

  function create(text: string): void {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    todos[id] = {id, 'complete': false, text};
  }

  function updateAll(updates: {complete?: boolean; text?: string;}): void {
    for (var id in todos) {
      update(id, updates);
    }
  }

  function update(id: string, {complete, text}: {complete?: boolean; text?: string;}): void {
    const todo = todos[id];
    typeof complete === 'undefined' || (todo.complete = complete);
    text && (todo.text = text);
  }

  function destroy(id: string): void {
    delete todos[id];
  }

  function destroyCompleted(): void {
    for (var id in todos) {
      todos[id].complete && destroy(id);
    }
  }

  // Register callback to handle all updates
  AppDispatcher.on('create', (text: string) => {
    text = text.trim();
    if (text !== '') {
      create(text);
      emitChange();
    }
  }).on('toggleCompleteAll', () => {
    updateAll({ 'complete': !areAllComplete() });
    emitChange();
  }).on('undoComplete', (id) => {
    update(id, { 'complete': false });
    emitChange();
  }).on('complete', (id) => {
    update(id, { 'complete': true });
    emitChange();
  }).on('updateText', ({id, text}) => {
    text = text.trim();
    if (text !== '') {
      update(id, {text});
      emitChange();
    }
  }).on('destroy', (id) => {
    destroy(id);
    emitChange();
  }).on('destroyCompleted', () => {
    destroyCompleted();
    emitChange();
  });
}

export interface Todo {
  id: string;
  complete: boolean;
  text: string;
}

export default TodoStore;
