/// <reference path="../../typings/main/index.d.ts" />

import { Answer } from '../app-state';
import * as AppState from '../app-state';
import {QuestionsWizard} from './QuestionsWizard';
import {AnswerDisplay} from './AnswerDisplay';


export class ReasonsWizard extends QuestionsWizard {
  onPrevButton = () => {
    this.gotoQuestion(this.state.questionIndex - 1);
  };

  onNextButton = () => {
    this.gotoQuestion(this.state.questionIndex + 1);
  };

  onAfterAnswer() {
    // empty on purpose
  }

  render() {
    const questionIndex = this.state.questionIndex;
    const question = this.question();
    const {questions, parties} = AppState.getState();

    if (!question) {
      return (<div>Loading</div>);
    }

    return (
      <div>
        <p className='initiative'>Initiative: {question.initiative}</p>
        <p className='questionText'>{question.text}</p>
        {this.renderAnswerButtons() }

        <div className='questionNavigation'>
          {false && questionIndex > 0 ?
            <button className='linkButton prevButton' onClick={this.onPrevButton}>Vorherige Frage</button>
            : null}
          {this.renderQuestionLinks() }
          {questionIndex < questions.length - 1 ?
            <button className='linkButton nextButton' onClick={this.onNextButton}>Nächste Frage</button>
            : null}
        </div>
        <div className='reasons'>
          {this.renderReason(
            `Initiative "${question.initiative}"`,
            question.initiativeAnswer,
            question.initiativeReason)
          }
          {parties.map(party =>
            this.renderReason(party.name, party.answers[question.id], party.reasons[question.id]))
          }
        </div>
      </div>
    );
  }


  renderReason(name: String, answer: Answer, reason: string) {
    return (
      <div className='reason'>
        <div><AnswerDisplay answer={answer}/> {name}</div>
        <blockquote>{reason}</blockquote>
      </div>
    );
  }
}
