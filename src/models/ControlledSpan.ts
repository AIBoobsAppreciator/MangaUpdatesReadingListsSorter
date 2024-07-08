type onToggleAction = (state: number) => void;

const states = ["", "↓", "↑"] as const;

export class ControlledSpan {
  private state = 0;
  private onToggle: onToggleAction = (state: number) => {};

  body: HTMLSpanElement = document.createElement("span");

  setOnToggle(action: onToggleAction) {
    this.onToggle = action;
  }

  clearState() {
    this.state = 0;
    this.body.innerText = states[0];
  }

  toggle() {
    this.state = (this.state + 1) % 3;
    this.body.innerText = states[this.state];
    this.onToggle(this.state);
  }
}
