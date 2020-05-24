import React from 'react';
import styles from './QuizSelector.module.css';

interface SelectorProps {
  changeQuiz: (qz : string) => any;
}

interface SelectorState {
  quizzes : string[];
}

export class QuizSelector extends React.Component<SelectorProps, SelectorState> {

  constructor(props:{changeQuiz: (qz : string) => any}) {
    super(props);
    this.state = {quizzes: []};
  }

  render() {
    return <div className={styles.container}>Hey</div>
  }
}