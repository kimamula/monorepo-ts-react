import * as React from 'react';
import TodoActions from 'todo-action';
import TodoTextInput from 'todo-text-input';

export default class Header extends React.Component<{}, void> {

  render(): JSX.Element {
    return (
      <header id="header">
        <h1>todos</h1>
        <TodoTextInput
          id="new-todo"
          placeholder="What needs to be done?"
          onSave={(text: string) => this.onSave(text)}
        />
      </header>
    );
  }

  private onSave(text: string): void {
    text.trim() && TodoActions.create(text);
  }

}
