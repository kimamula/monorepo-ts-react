import * as React from 'react';
import TodoActions from 'todo-action';
import TodoItem from './components/TodoItem';
import {Todo} from 'todo-store'

export default class MainSection extends React.Component<{
    allTodos: {[id: string]: Todo};
    areAllComplete: boolean;
}, void> {

  render(): JSX.Element {
    const todos = Object.keys(this.props.allTodos)
      .map((id) => <TodoItem todo={this.props.allTodos[id]} />);

      return todos.length ? (
        <section id="main">
          <input
            id="toggle-all"
            type="checkbox"
            onChange={() => {
              this.onToggleCompleteAll();
            }}
            checked={this.props.areAllComplete}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul id="todo-list">{todos}</ul>
        </section>
      ) : null;
  }

  private onToggleCompleteAll(): void {
    TodoActions.toggleCompleteAll();
  }

}
