import AppDispatcher from 'todo-dispatcher';
import {Todo} from 'todo-store';

namespace TodoActions {

  export function create(text: string): void {
    AppDispatcher.emit('create', text);
  }

  export function updateText(id: string, text: string): void {
    AppDispatcher.emit('updateText', {id, text});
  }

  export function toggleComplete(todo: Todo): void {
    if (todo.complete) {
      AppDispatcher.emit('undoComplete', todo.id);
    } else {
      AppDispatcher.emit('complete', todo.id);
    }
  }

  export function toggleCompleteAll(): void {
    AppDispatcher.emit('toggleCompleteAll');
  }

  export function destroy(id: string): void {
    AppDispatcher.emit('destroy', id);
  }

  export function destroyCompleted(): void {
    AppDispatcher.emit('destroyCompleted');
  }

}

export default TodoActions;
