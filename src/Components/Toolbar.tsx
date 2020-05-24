import React from 'react';

interface ToolbarProps {
  showQuiz : () => any;
}

export class Toolbar extends React.Component<ToolbarProps, {}> {
  render() {
    return (
      <div id="toolbar">
        <button onClick={() => this.props.showQuiz()}>
          Take A Quiz
        </button>
      </div>
    )
  }
}