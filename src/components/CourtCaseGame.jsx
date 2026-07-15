import React, { useState } from 'react';
import './NewFeatures.css';
import './Modal.css';

const CASE_SCENARIOS = [
  {
    title: 'Breach of Contract',
    opening:
      'The plaintiff claims you failed to deliver goods as promised. The evidence is circumstantial.',
    rounds: [
      {
        question: 'The prosecutor asks: "Did you sign the contract willingly?"',
        choices: [
          {
            text: 'Yes, but there were oral amendments.',
            outcome: 'good',
            response: 'The judge nods. "Oral amendments can be binding."',
          },
          {
            text: 'No, I was pressured.',
            outcome: 'bad',
            response: 'The prosecutor produces a signed document. "Lies!" they shout.',
          },
          {
            text: 'I refuse to answer.',
            outcome: 'neutral',
            response: 'The jury murmurs. Silence is not helping.',
          },
        ],
      },
      {
        question: '"Can you explain the missing inventory?"',
        choices: [
          {
            text: 'It was lost in transit. Here are the shipping logs.',
            outcome: 'good',
            response: 'The logs confirm your story. The jury looks convinced.',
          },
          {
            text: 'I have no idea what happened.',
            outcome: 'bad',
            response: '"Incompetence!" the plaintiff yells.',
          },
          {
            text: 'The plaintiff is lying.',
            outcome: 'neutral',
            response: '"Prove it," the judge says.',
          },
        ],
      },
      {
        question: '"Do you have anything to say to the jury?"',
        choices: [
          {
            text: 'I take full responsibility and offer to settle.',
            outcome: 'good',
            response: 'The jury appreciates your honesty.',
          },
          {
            text: 'This whole case is a waste of time.',
            outcome: 'bad',
            response: 'The judge warns you for contempt.',
          },
          {
            text: 'I did my best. Sometimes things go wrong.',
            outcome: 'neutral',
            response: 'A few jurors nod sympathetically.',
          },
        ],
      },
    ],
  },
  {
    title: 'Property Dispute',
    opening:
      'Your neighbor claims your renovation encroaches on their land. The survey is unclear.',
    rounds: [
      {
        question: '"Did you check the property lines before building?"',
        choices: [
          {
            text: 'Yes, I have a recent survey.',
            outcome: 'good',
            response: 'The survey supports your case.',
          },
          {
            text: 'I assumed the old fence was the boundary.',
            outcome: 'bad',
            response: 'The neighbor smirks. "Assumptions aren\'t facts."',
          },
          {
            text: 'The contractor handled it.',
            outcome: 'neutral',
            response: '"Then why isn\'t the contractor here?" the judge asks.',
          },
        ],
      },
      {
        question: '"Were there any warnings about the boundary?"',
        choices: [
          {
            text: 'No, this is the first I heard of it.',
            outcome: 'good',
            response: 'The neighbor admits they never formally notified you.',
          },
          {
            text: 'They mentioned it once but I ignored it.',
            outcome: 'bad',
            response: '"So you did know!" the prosecutor exclaims.',
          },
          {
            text: 'There were vague rumors.',
            outcome: 'neutral',
            response: '"Rumors are not evidence," says the judge.',
          },
        ],
      },
    ],
  },
];

export function CourtCaseGame({ onResult, onClose, t = (key, fallback) => fallback || key }) {
  const [caseData, setCaseData] = useState(null);
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState('select');
  const [score, setScore] = useState(0);
  const [lastResponse, setLastResponse] = useState(null);

  const startCase = idx => {
    setCaseData(CASE_SCENARIOS[idx]);
    setScenarioIdx(idx);
    setRound(0);
    setScore(0);
    setPhase('playing');
    setLastResponse(null);
  };

  const handleChoice = (choice, choiceIdx) => {
    const points = choice.outcome === 'good' ? 30 : choice.outcome === 'neutral' ? 10 : -10;
    setScore(prev => prev + points);
    setLastResponse(
      t(
        `courtcase.scenario${scenarioIdx + 1}.round${round + 1}.response${choiceIdx + 1}`,
        choice.response
      )
    );

    setTimeout(() => {
      const currentCase = CASE_SCENARIOS.find(c => c.title === caseData.title);
      if (round + 1 >= currentCase.rounds.length) {
        setPhase('result');
      } else {
        setRound(prev => prev + 1);
        setLastResponse(null);
      }
    }, 1200);
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        style={{ maxWidth: '440px', position: 'relative', minHeight: '300px' }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{t('courtcase.title', 'Court Case')}</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {phase === 'select' && (
            <div>
              <h3 className="section-heading">{t('courtcase.selectCase', 'Select a Case')}</h3>
              <div className="stack-list">
                {CASE_SCENARIOS.map((c, i) => (
                  <button
                    key={i}
                    className="list-item"
                    onClick={() => startCase(i)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong>{t(`courtcase.scenario${i + 1}.title`, c.title)}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '4px' }}>
                        {t(`courtcase.scenario${i + 1}.opening`, c.opening)}
                      </div>
                    </div>
                    <span style={{ color: '#03a9f4', fontSize: '0.8rem', fontWeight: 700 }}>
                      {t('courtcase.try', 'TRY')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === 'playing' && caseData && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                  fontSize: '0.78rem',
                  color: '#888',
                }}
              >
                <span>{t(`courtcase.scenario${scenarioIdx + 1}.title`, caseData.title)}</span>
                <span>
                  {t('courtcase.score', 'Score: ')}
                  <strong style={{ color: '#ffd700' }}>{score}</strong>
                </span>
              </div>

              <div className="dialogue-box">
                <div style={{ fontSize: '0.78rem', color: '#ffd700', marginBottom: '6px' }}>
                  {t('courtcase.judge', 'Judge:')}
                </div>
                {lastResponse ? (
                  <div style={{ color: '#a0a0b0', fontStyle: 'italic' }}>{lastResponse}</div>
                ) : (
                  <div>
                    {t(
                      `courtcase.scenario${scenarioIdx + 1}.round${round + 1}.question`,
                      caseData.rounds[round]?.question
                    )}
                  </div>
                )}
              </div>

              {!lastResponse && (
                <div className="stack-list" style={{ marginTop: '12px' }}>
                  {caseData.rounds[round]?.choices.map((choice, i) => (
                    <button key={i} className="choice-btn" onClick={() => handleChoice(choice, i)}>
                      {t(
                        `courtcase.scenario${scenarioIdx + 1}.round${round + 1}.choice${i + 1}`,
                        choice.text
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {phase === 'result' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div
                style={{
                  fontSize: '2rem',
                  marginBottom: '8px',
                  color: score > 0 ? '#00e676' : '#ff1744',
                }}
              >
                {score > 20 ? '✓' : '✕'}
              </div>
              <div
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  marginBottom: '8px',
                  color: score > 20 ? '#00e676' : '#ff1744',
                }}
              >
                {score > 20
                  ? t('courtcase.caseWon', 'Case Won!')
                  : score > 0
                    ? t('courtcase.partialVictory', 'Partial Victory')
                    : t('courtcase.caseLost', 'Case Lost')}
              </div>
              <div style={{ color: '#888', marginBottom: '16px' }}>
                {t('courtcase.finalScore', 'Final Score: ')}
                {score}
                <br />
                {score > 20
                  ? t('courtcase.juryRuled', 'The jury ruled in your favor.')
                  : score > 0
                    ? t('courtcase.someClaimsAccepted', 'Some claims were accepted.')
                    : t('courtcase.orderedDamages', 'You have been ordered to pay damages.')}
              </div>
              <button
                className="btn-primary"
                onClick={() => onResult(score > 20 ? 'win' : score > 0 ? 'partial' : 'lose')}
              >
                {t('courtcase.verdictAccepted', 'Verdict Accepted')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
