import * as React from 'react';

let ENTER_KEY_CODE = 13;

export interface Props {
    className?: string;
    id?: string;
    placeholder?: string;
    onSave: (value: string) => void;
    value?: string;
}

export default class TodoTextInput extends React.Component<Props, {value: string;}> {

  constructor(props: Props) {
    super(props);
    this.state = { 'value': props.value || '' };
  }

  render(): JSX.Element  {
    return (
      <input
        className={this.props.className}
        id={this.props.id}
        placeholder={this.props.placeholder}
        onBlur={() => this.save()}
        onChange={(event) => this.onChange(event)}
        onKeyDown={(event) => this.onKeyDown(event)}
        value={this.state.value}
        autoFocus={true}
      />
    );
  }

  private save(): void {
    this.props.onSave(this.state.value);
    this.setState({ 'value': '' });
  }

  private onChange(event: React.FormEvent): void {
    this.setState({ 'value': event.target['value'] });
  }

  private onKeyDown(event: React.KeyboardEvent): void {
    if (event.keyCode === ENTER_KEY_CODE) {
      this.save();
    }
  }

}
