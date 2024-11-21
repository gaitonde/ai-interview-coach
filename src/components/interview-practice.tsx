'use client';

import AudioRecorder from "@/components/audio-recorder";
import { useState, useEffect } from 'react';
import Scoring from "./scoring";
import { get } from 'idb-keyval';
import { useRouter } from 'next/navigation';
import { Footer } from "./footer";
import styles from '../styles/interview-practice.module.css';
import { Button } from "./ui/button";

type EvaluatingState = 'Ready' | 'Evaluating';

interface Question {
  id: number;
  questionId?: string;
  category: string;
  question: string;
  why: string;
  focus: string;
}

interface ScoringResult {
  foundationalKnowledge: number;
  problemSolvingAndLearningPotential: number;
  behavioralAndSoftSkills: number;
  culturalFitAndMotivation: number;
  initiativeAndLeadershipPotential: number;
  starMethodAdherence: number;
  confidenceAndProfessionalism: number;
  finalScore: number;
  averageScore: number;
  };

export default function InterviewPractice() {
  const router = useRouter();
  const [versions, setVersions] = useState<Array<{
    answerId: string;
    questionId: string;
    transcript: string | null;
    aiScoringResult: ScoringResult | null;
    audioUrl: string;
    recordingTimestamp: Date;
  }>>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [expandedVersionIndex, setExpandedVersionIndex] = useState<number | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [manualTranscript, setManualTranscript] = useState('');
  const [whom, setWhom] = useState('');
  const [inputMode, setInputMode] = useState<'record' | 'type'>('record');
  const [evaluatingState, setEvaluatingState] = useState<EvaluatingState>('Ready');
  const [questions, setQuestions] = useState<Array<Question>>([]);
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [isDemo, setIsDemo] = useState(true);

  const getQuestionId = (question: Question | null): string => {
    if (!question) return '';
    return question.questionId || question.id?.toString() || '';
  };

  async function saveAnswer(questionId: string, transcript: string) {
    const profileId = localStorage.getItem('profileId');
    const response = await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, questionId, transcript }),
    });
    const json = await response.json();
    return json.id;
  }

  const handleTranscriptionComplete = async (newTranscript: string, newAudioUrl: string) => {
    const answerId = await saveAnswer(question?.id?.toString() || '', newTranscript);

    const versionNumber = getNextVersionNumber();
    const key = `audio_v${versionNumber}`;
    const audioBlob = await get(key);
    newAudioUrl = URL.createObjectURL(audioBlob);

    const newVersion = {
      answerId,
      questionId: question?.id?.toString() || '',
      transcript: newTranscript,
      aiScoringResult: null,
      audioUrl: newAudioUrl,
      recordingTimestamp: new Date(),
    };
    setVersions(prevVersions => [newVersion, ...prevVersions]);
    setExpandedVersionIndex(0); // Expand the newest version
    await handleAiScoring(answerId, 0);
  };

  const handleAiScoring = async (answerId: number, versionIndex: number) => {
    if (!answerId) {
      console.error('Need an answerId to do scoring.');
      return;
    }

    try {
      const questionId = question?.id;
      const profileId = localStorage.getItem('profileId');

      const response = await fetch('/api/generate-ai-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answerId, profileId, questionId }),
      });
      if (!response.ok) {
        throw new Error('AI Scoring failed');
      }
      const result = await response.json();
      setVersions(prevVersions => {
        const newVersions = [...prevVersions];
        newVersions[versionIndex] = {
          ...newVersions[versionIndex],
          aiScoringResult: result,
        };
        return newVersions;
      });
    } catch (error) {
      console.error('AI Scoring error:', error);
    } finally {
      setEvaluatingState('Ready');
    }
  };

  // Add this new function to handle expanding/collapsing versions
  const handleVersionToggle = (index: number) => {
    setExpandedVersionIndex(prevIndex => prevIndex === index ? null : index);
  };

  // Use useEffect to collapse all versions except the most recent when a new recording is added
  useEffect(() => {
    const mode = localStorage.getItem('mode');
    const isDemo = mode === 'demo';
    setIsDemo(isDemo);

    if (versions.length > 0) {
      setShowDebug(false);
      setExpandedVersionIndex(0);
    }

    const profileId = localStorage.getItem('profileId');

    const fetchJob = async () => {
      try {
        if (profileId) {
          const response = await fetch(`/api/jobs?profileId=${profileId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch questions');
          }
          const json = await response.json();
          const data = json.content;
          let interviewer = '';

          if (data.interviewer_name && data.interviewer_role) {
            interviewer = `${data.interviewer_name} (${data.interviewer_role})`;
          } else if (data.interviewer_name) {
            interviewer = `${data.interviewer_name}`;
          } else if (data.interviewer_role) {
            interviewer = `${data.interviewer_role}`;
          }
          setWhom(interviewer);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching questions response:', error);
      }
    }

    const fetchQuestions = async () => {
      try {
        if (profileId) {
          const response = await fetch(`/api/questions?profileId=${profileId}&mode=${mode}`);
          if (!response.ok) {
            throw new Error('Failed to fetch questions');
          }
          const data = await response.json();
          console.log('QUESTIONS!!', data);
          // Filter out duplicate questions by questionId
          let questions;
          if (isDemo) {
            questions = data.reduce((acc: Question[], curr: Question) => {
              const exists = acc.find(q => q.questionId === curr.questionId);
              if (!exists) {
                acc.push(curr);
              }
              return acc;
            }, []);
          } else {
            questions = data;
          }
          console.log('UNIQUE QUESTIONS!!', questions);
          setQuestions(questions);
          setQuestion(questions[0]);
          setQuestionIndex(0);

          if (isDemo && data.length > 0) {
            const demoVersions = data.map((item: Question & { answerId: string; answer: string; scores: ScoringResult; recordingTimestamp: string }) => ({
              answerId: item.answerId,
              questionId: item.questionId,
              transcript: item.answer,
              aiScoringResult: item.scores,
              audioUrl: '',
              recordingTimestamp: new Date(item.recordingTimestamp),
            }));
            console.log('DEMO VERSIONS', demoVersions);
            setVersions(demoVersions);
            setExpandedVersionIndex(0);
          }
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching questions response:', error);
      }
    }

    if (!whom) {
      fetchJob();
    }
    if (questionIndex < 0) {
      fetchQuestions();
    }
  }, [versions.length]);

  // Add this function to get the next version number
  const getNextVersionNumber = () => versions.length + 1;

  return (
    <>
      <div className="flex flex-col min-h-screen bg-[#111827]">
        <main className="flex-grow flex justify-center px-4 sm:px-6 lg:px-8 mt-6">
          <div className="w-full max-w-3xl p-6 sm:p-8 sm:space-y-8 bg-[#1F2937] rounded-xl shadow-md mb-4">
            <div className="markdown-content text-[#F9FAFB]">
              <h1 className={styles.h1}>Interview Jam Session</h1>
            {whom && <h3 className={styles.h3}>with {whom}</h3>}
            </div>
            {questions.length > 0 && (
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                  <h2 className="text-black"><b>Category:</b> {question?.category}</h2>
                  <span className="text-black whitespace-nowrap"><b>Question:</b> {questionIndex + 1} of {questions.length}</span>
                  <hr className="border-gray-300 w-full sm:hidden" />
                </div>
                <h3 className="text-md text-black mb-4">
                  <b>Question:</b> {question?.question}
                </h3>
                <h3 className="text-md text-black mb-4">
                  <b>Why:</b> {question?.why}
                </h3>
                <h3 className="text-md text-black mb-4">
                  <b>Focus:</b> {question?.focus}
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    className="flex-1 text-white bg-[#7C3AED] hover:bg-[#4338CA] disabled:bg-gray-400 py-2 px-4 rounded-md transition-colors"
                    disabled={questionIndex === 0}
                    onClick={() => {
                      const previousIndex = questionIndex - 1;
                      setQuestionIndex(previousIndex);
                      setQuestion(questions[previousIndex]);
                    }}
                  >
                    <span className="sm:hidden">Previous</span>
                    <span className="hidden sm:inline">Previous Question</span>
                  </button>
                  <button
                    className="flex-1 text-white bg-[#7C3AED] hover:bg-[#4338CA] disabled:bg-gray-400 py-2 px-4 rounded-md transition-colors"
                    disabled={questionIndex === questions.length - 1}
                    onClick={() => {
                      const nextIndex = questionIndex + 1;
                      setQuestionIndex(nextIndex);
                      setQuestion(questions[nextIndex]);
                    }}
                  >
                    <span className="sm:hidden">Next</span>
                    <span className="hidden sm:inline">Next Question</span>
                  </button>
                </div>
              </div>
            )}
            {!isDemo && (
            <div className="p-4 bg-white rounded-lg shadow mt-4">
              <div className="mb-4">
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="record"
                      checked={inputMode === 'record'}
                      onChange={(e) => setInputMode('record')}
                      className="form-radio text-[#7C3AED]"
                    />
                    <span className="ml-2 text-black">Voice Record Answer</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="type"
                      checked={inputMode === 'type'}
                      onChange={(e) => setInputMode('type')}
                      className="form-radio text-[#7C3AED]"
                    />
                    <span className="ml-2 text-black">Type Answer</span>
                </label>
              </div>
            </div>

            {(inputMode === 'record' && (question?.id)) ? (
              <div className="flex items-center space-x-4">
                <AudioRecorder
                  onTranscriptionComplete={handleTranscriptionComplete}
                  version={getNextVersionNumber()}
                  questionId={question.id.toString()}
                />
              </div>
            ) : (inputMode === 'type' && (question?.id)) ? (
              <div className="flex flex-col space-y-4">
                <textarea
                  className="w-full h-24 p-2 border border-gray-300 text-black rounded-md"
                  placeholder="Type or paste your answer here..."
                  value={manualTranscript}
                  onChange={(e) => {
                    setManualTranscript(e.target.value);
                  }}
                />
                <button
                  className="text-white bg-[#10B981] hover:bg-[#059669] disabled:bg-gray-400 py-2 px-4 rounded-md transition-colors"
                  disabled={questions.length < 0 || !manualTranscript.trim()}
                  onClick={async () => {
                  setEvaluatingState('Evaluating');
                  const answerId = await saveAnswer(question?.id?.toString() || '', manualTranscript);
                  const newVersion = {
                    answerId,
                    questionId: question?.id?.toString() || '',
                    transcript: manualTranscript,
                    aiScoringResult: null,
                    audioUrl: '',
                    recordingTimestamp: new Date(),
                  };
                  setVersions(prevVersions => [newVersion, ...prevVersions]);
                  handleAiScoring(answerId, 0);
                  setManualTranscript('');
                }}
              >
                {evaluatingState === 'Ready' ? 'Evaluate Answer' : 'Evaluating...'}
              </button>
            </div>
          ) : null }
        </div>
        )}
        {versions.map((version, index) => (
        <div key={index} className="text-black my-8">
          {showDebug && version.aiScoringResult && (
            <div className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Raw AI Scoring Result (Version {versions.length - index}):</h2>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-md">
                {JSON.stringify(version.aiScoringResult, null, 2)}
              </pre>
            </div>
          )}
          {version.aiScoringResult && (
            <Scoring
              answerId={version.answerId}
              question={question?.question || ''}
              questionId={getQuestionId(question)}
              finalScore={version.aiScoringResult.finalScore}
              averageScore={version.aiScoringResult.averageScore}
              definedRound={`AI Evaluation (Version ${versions.length - index})`}
              categories={[
                { name: 'Foundational Knowledge', score: version.aiScoringResult.foundationalKnowledge },
                { name: 'Problem Solving & Learning', score: version.aiScoringResult.problemSolvingAndLearningPotential },
                { name: 'Behavioral & Soft Skills', score: version.aiScoringResult.behavioralAndSoftSkills },
                { name: 'Cultural Fit & Motivation', score: version.aiScoringResult.culturalFitAndMotivation },
                { name: 'Initiative & Leadership', score: version.aiScoringResult.initiativeAndLeadershipPotential },
                { name: 'STAR Method Adherence', score: version.aiScoringResult.starMethodAdherence },
                { name: 'Confidence & Professionalism', score: version.aiScoringResult.confidenceAndProfessionalism },
              ]}
              transcript={version.transcript}
              audioUrl={version.audioUrl}
              recordingTimestamp={version.recordingTimestamp}
              versionNumber={versions.length - index}
              isExpanded={index === expandedVersionIndex}
              onToggle={() => handleVersionToggle(index)} // Add this line
            />
          )}
          </div>
          ))}
          {questions.length > 0 && (<div className="my-4">
            <Button
              onClick={() => {
                localStorage.removeItem('mode');
                router.push('/');
              }}
              className="w-full bg-[#10B981] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#0e9370] transition-colors"
            >
              Home
            </Button>
          </div>
          )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
