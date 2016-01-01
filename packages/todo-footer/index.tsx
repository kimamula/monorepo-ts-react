import * as React from 'react';
import TodoActions from 'todo-action';
import {Todo} from 'todo-store'

export default class Footer extends React.Component<{allTodos: {[id: string]: Todo}}, {}> {

  render(): JSX.Element {
    const allTodos = this.props.allTodos, todoIds = Object.keys(allTodos);
    let completed = 0, itemsLeft = 0, clearCompletedButton: JSX.Element;

    if (todoIds.length === 0) {
      return null;
    }

    todoIds.forEach((id) => {
      if (allTodos[id].complete) {
        completed++;
      } else {
        itemsLeft++;
      }
    });

    const itemsLeftPhrase = (itemsLeft > 1 ? ' items ' : ' item ') + 'left';

    if (completed) {
      clearCompletedButton =
        <button id="clear-completed" onClick={() => this.onClearCompletedClick()}>
          Clear completed ({completed})
        </button>;
    }

    return (
      <footer id="footer">
        <span id="todo-count">
          <strong>{itemsLeft}</strong>{itemsLeftPhrase}
        </span>
        {clearCompletedButton}
      </footer>
    );
  }

  private onClearCompletedClick(): void {
    TodoActions.destroyCompleted();
  }

}
