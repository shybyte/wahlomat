/// <reference path="../../typings/main/index.d.ts" />

import * as React from 'react';
import * as classNames from 'classnames';
import { hashHistory } from 'react-router';



import { Answer, ANSWER, Question, Candidate, Region } from '../app-state-interfaces';
import { ROUTES } from '../routes';
import * as AppState from '../app-state';
import {AnswerDisplay} from './AnswerDisplay';
import {WahlkreiseMap} from './WahlkreiseMap';



const {skipped, yes, no, neutral} = ANSWER;

interface WizardState {
  questionIndex?: number;
  showReasons?: boolean;
}

export class QuestionsWizard extends React.Component<{}, WizardState> {
  state = {
    questionIndex: 0,
    showReasons: false
  };

  onAnswer = (answer: Answer) => {
    const appState = AppState.getState();
    const answers = appState.answers;
    const question = this.question();
    if ((answer !== skipped || !answers[question.id])) {
      AppState.setAnswer(question.id, answer);
    }
    this.onAfterAnswer();
  };

  onAfterAnswer() {
    setTimeout(() => {
      const nextQuestionIndex = this.state.questionIndex + 1;
      if (nextQuestionIndex < AppState.getState().questions.length) {
        this.gotoQuestion(nextQuestionIndex);
      } else {
        this.continueToWeighting();
      }
    }, 200);
  }

  skipAll = () => {
    this.continueToWeighting();
  }

  continueToWeighting() {
    hashHistory.push(ROUTES.weighting);
    AppState.setQuestionsDone();
  }

  question = () => AppState.getState().questions[this.state.questionIndex];

  gotoQuestion = (questionIndex: number) => {
    this.setState({ questionIndex });
  };

  toggleShowReasons = () => {
    this.setState({ showReasons: !this.state.showReasons });
  };

  hasNonSkippedAnswer = (q: Question) => {
    const answer = AppState.getState().answers[q.id];
    return answer && answer !== skipped;
  }

  render() {
    const question = this.question();
    const regions = AppState.getSortedRegions();
    const {showReasons} = this.state;
    const toggleReasonsButtonText = showReasons ?
      'Verstecke die Antworten der Parteien und Initiativen'
      : 'Zeige die Antworten der Parteien und Initiativen';
    const reasonsStyles = classNames('reasons', { visible: showReasons });
    if (!question) {
      return (<div>Loading</div>);
    }

    return (
      <div>
        <p className='initiative'>Initiative: {question.initiative}</p>
        <p className='questionText'>{question.text}</p>
        {this.renderAnswerButtons() }
        <div className='questionNavigation'>
          {this.renderQuestionLinks() }
          <button className='linkButton skipButton' onClick={() => this.onAnswer(skipped) }>Frage überspringen</button>
          <button className='linkButton skipAllButton' onClick={() => this.skipAll() }>Alle Fragen überspringen</button>
        </div>

        <button className='linkButton' onClick={() => this.toggleShowReasons() }>{toggleReasonsButtonText}</button>
        <div className={reasonsStyles}>
          {this.renderReasonsOfInitiative(question) }
          {regions.map(region => this.renderReasonsInRegion(region)) }
          <WahlkreiseMap/>
        </div>
      </div>
    );
  }

  renderReasonsOfInitiative(question: Question) {
    if (!question.initiativeReason) {
      return null;
    }
    return <div className='reasonsInRegion'>
      <h2>In­i­ti­a­ti­ve</h2>
      {
        this.renderReason('initiative',
          question.initiative,
          question.initiativeAnswer,
          question.initiativeReason)
      }
    </div>;
  }

  renderReasonsInRegion(region: Region) {
    return <div key={region.id} className='reasonsInRegion'>
      <h2>{region.name}</h2>
      {
        AppState.getCandidatesInRegion(region).map(candidate =>
          this.renderReasonCandidate(candidate))
      }
    </div>;
  }

  renderAnswerButtons() {
    const question = this.question();
    const buttonClass = (a: Answer) => classNames('answerButton-' + a, {
      selected: AppState.getState().answers[question.id] === a
    });
    return (
      <div className='buttonGroup'>
        <button className={buttonClass(yes) } onClick={() => this.onAnswer(yes) }>stimme  zu</button>
        <button className={buttonClass(neutral) } onClick={() => this.onAnswer(neutral) }>neutral</button>
        <button className={buttonClass(no) } onClick={() => this.onAnswer(no) }>stimme nicht zu</button>
      </div>
    );
  }

  renderQuestionLinks() {
    return (
      <div className='questionLinks'>
        {
          AppState.getState().questions.map((question, i) => (
            <span key={question.id}
              onClick={() => this.gotoQuestion(i) }
              className={classNames('questionLink', {
                hasAnswer: this.hasNonSkippedAnswer(question),
                selected: this.question().id === question.id
              }) }>
              {question.id}
            </span>
          ))
        }
        <span></span>
      </div>
    );
  }

  renderReason(key: string, name: String, answer: Answer, reason: string) {
    return (
      <div key={key} className='reason'>
        <div><AnswerDisplay answer={answer}/> <strong> {name}</strong> </div>
        <blockquote>{reason}</blockquote>
      </div>
    );
  }

  renderReasonCandidate(candidate: Candidate) {
    const question = this.question();
    return (
      <div key={candidate.id} className='reason'>
        <div>
          <AnswerDisplay answer={candidate.answers[question.id]}/>
          <strong> {candidate.name} </strong>
          ({candidate.party})
        </div>
        <blockquote>{candidate.reasons[question.id]}</blockquote>
      </div>
    );
  }


}
