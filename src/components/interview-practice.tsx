'use client'

import AudioRecorder from '@/components/audio-recorder'
import { Button } from '@/components/ui/button'
import { interviewIdAtom, isDemoAtom, profileIdAtom } from '@/stores/profileAtoms'
import { removeDemoData } from '@/utils/auth'
import { get } from 'idb-keyval'
import { useAtom } from 'jotai'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import styles from '../styles/interview-practice.module.css'
import ConditionalHeader from '@/components/conditional-header'
import Scoring from '@/components/scoring'

type EvaluatingState = 'Ready' | 'Evaluating'

interface Answer {
  answerId: string
  answer: string
  scores: ScoringResult
  recordingTimestamp: string
}

interface Question {
  id: number
  questionId?: string
  category: string
  question: string
  why: string
  focus: string
  // For demo data
  answerId?: string  // Optional fields from the API response
  answer?: string  // Optional fields from the API response
  scores?: ScoringResult  // Optional fields from the API response
  recordingTimestamp?: string  // Optional fields from the API response
  feedback?: string  // Optional field from the API response
  answers?: Array<Answer>  // Processed answers array
}

interface ScoringResult {
  foundationalKnowledge: number
  problemSolvingAndLearningPotential: number
  behavioralAndSoftSkills: number
  culturalFitAndMotivation: number
  initiativeAndLeadershipPotential: number
  starMethodAdherence: number
  confidenceAndProfessionalism: number
  finalScore: number
  averageScore: number
}

export function InterviewPracticeContent() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const router = useRouter()
  const [versions, setVersions] = useState<Array<{
    answerId: string
    questionId: string
    transcript: string | null
    aiScoringResult: ScoringResult | null
    audioUrl: string
    recordingTimestamp: Date
  }>>([])
  const [showDebug, setShowDebug] = useState(false)
  const [expandedVersionIndex, setExpandedVersionIndex] = useState<number | null>(null)
  const [question, setQuestion] = useState<Question | null>(null)
  const [manualTranscript, setManualTranscript] = useState('')
  const [whom, setWhom] = useState('')
  const [inputMode, setInputMode] = useState<'record' | 'type'>('record')
  const [evaluatingState, setEvaluatingState] = useState<EvaluatingState>('Ready')
  const [questions, setQuestions] = useState<Array<Question>>([])
  const [questionIndex, setQuestionIndex] = useState(-1)
  const [isDemo] = useAtom(isDemoAtom)
  const [profileId] = useAtom(profileIdAtom)
  const [interviewId] = useAtom(interviewIdAtom)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const getQuestionId = (question: Question | null): string => {
    if (!question) return '';
    return question.questionId || question.id?.toString() || ''
  };

  async function saveAnswer(questionId: string, transcript: string) {
    const response = await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, interviewId, questionId, transcript }),
    });
    const json = await response.json();
    return json.id;
  }

  const handleTranscriptionComplete = async (newTranscript: string, newAudioUrl: string) => {
    const answerId = await saveAnswer(question?.id?.toString() || '', newTranscript)

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
    }
    setVersions(prevVersions => [newVersion, ...prevVersions])
    setExpandedVersionIndex(0); // Expand the newest version
    await handleAiScoring(answerId, 0)
  };

  const handleAiScoring = async (answerId: string | number, versionIndex: number) => {
    if (!answerId) {
      console.error('Need an answerId to do scoring.');
      return;
    }

    try {
      const questionId = question?.id
      const response = await fetch('/api/generate-ai-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answerId: answerId.toString(),
          interviewId,
          profileId,
          questionId,
          category: question?.category
        }),
      });
      if (!response.ok) {
        throw new Error('AI Scoring failed')
      }
      const result = await response.json()
      setVersions(prevVersions => {
        const newVersions = [...prevVersions]
        newVersions[versionIndex] = {
          ...newVersions[versionIndex],
          aiScoringResult: result,
        };
        return newVersions
      });
    } catch (error) {
      console.error('AI Scoring error:', error)
    } finally {
      setManualTranscript('')
      setIsSubmitting(false)
      setEvaluatingState('Ready')
    }
  }

  // Add this new function to handle expanding/collapsing versions
  const handleVersionToggle = (index: number) => {
    setExpandedVersionIndex(prevIndex => prevIndex === index ? null : index);
  };

  // Use useEffect to collapse all versions except the most recent when a new recording is added
  useEffect(() => {

    if (versions.length > 0) {
      setShowDebug(false);
      setExpandedVersionIndex(0);
    }

    const fetchInterview = async () => {
      try {
        if (profileId) {
          const response = await fetch(`/api/interviews?profileId=${profileId}&interviewId=${interviewId}`);
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
          const categoryParam = category ? `&category=${encodeURIComponent(category)}` : ''
          const modeParam = isDemo ? `&mode=demo` : ''
          const response = await fetch(`/api/questions?profileId=${profileId}&interviewId=${interviewId}${modeParam}${categoryParam}`)
          if (!response.ok) {
            throw new Error('Failed to fetch questions')
          }
          const data = await response.json()
          console.log('QUESTIONS!!', data)
          // Filter out duplicate questions by questionId
          let questions = data
          questions = data.reduce((acc: Question[], curr: Question) => {
            const existingQuestion = acc.find(q => q.questionId === curr.questionId);
            if (!existingQuestion) {
              const newQuestion: Question = {
                ...curr,
                id: curr.questionId ? parseInt(curr.questionId) : 0,
                answers: curr.answerId ? [{
                  answerId: curr.answerId || '',
                  answer: curr.answer || '',
                  scores: curr.scores || {
                    foundationalKnowledge: 0,
                    problemSolvingAndLearningPotential: 0,
                    behavioralAndSoftSkills: 0,
                    culturalFitAndMotivation: 0,
                    initiativeAndLeadershipPotential: 0,
                    starMethodAdherence: 0,
                    confidenceAndProfessionalism: 0,
                    finalScore: 0,
                    averageScore: 0,
                  },
                  recordingTimestamp: curr.recordingTimestamp || '',
                }] : undefined
              };

              acc.push(newQuestion);
            } else if (curr.answerId) {
              if (!existingQuestion.answers) {
                existingQuestion.answers = [];
              }
              existingQuestion.answers.push({
                answerId: curr.answerId,
                answer: curr.answer || '',
                scores: curr.scores || {
                  foundationalKnowledge: 0,
                  problemSolvingAndLearningPotential: 0,
                  behavioralAndSoftSkills: 0,
                  culturalFitAndMotivation: 0,
                  initiativeAndLeadershipPotential: 0,
                  starMethodAdherence: 0,
                  confidenceAndProfessionalism: 0,
                  finalScore: 0,
                  averageScore: 0,
                },
                recordingTimestamp: curr.recordingTimestamp || '',
              });
            }
            return acc;
          }, []);

          console.log('UNIQUE QUESTIONS!!', questions);
          setQuestions(questions)
          console.log('XXXX QUESTION 0 ', questions[0])
          console.log('XXXX QUESTION 0 ID ', questions[0].id)
          setQuestion(questions[0])
          setQuestionIndex(0)

          if (questions.length > 0) {
            // Convert all answers from all questions into versions
            const demoVersions = questions
              .flatMap((q: { answers?: Array<{ answerId: string; answer: string; scores: ScoringResult; recordingTimestamp: string }>; }) => q.answers || [])
              .map((answer: { answerId: string; answer: string; scores: ScoringResult; recordingTimestamp: string }) => ({
                answerId: answer.answerId,
                questionId: getQuestionId(question),
                transcript: answer.answer,
                aiScoringResult: answer.scores,
                audioUrl: '',
                recordingTimestamp: new Date(answer.recordingTimestamp),
              }))
              .sort((a: { answerId: number }, b: { answerId: number }) => b.answerId - a.answerId) as Array<{
                answerId: string;
                questionId: string;
                transcript: string | null;
                aiScoringResult: ScoringResult | null;
                audioUrl: string;
                recordingTimestamp: Date;
              }>;
            console.log('DEMO VERSIONS', demoVersions)
            setVersions(demoVersions)
            setExpandedVersionIndex(0)
          }
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Error fetching questions response:', error);
      }
    }

    if (!whom) {
      fetchInterview();
    }
    if (questionIndex < 0) {
      fetchQuestions();
    }
  }, [versions.length]);

  // Add this function to get the next version number
  const getNextVersionNumber = () => versions.length + 1;

  return (
    <>
      <ConditionalHeader />
      <div className="flex flex-col min-h-screen bg-[#111827]">
        <div className="flex-grow flex justify-center px-4 sm:px-6 lg:px-8 mt-6">
          <div className="w-full max-w-3xl p-6 sm:p-8 sm:space-y-8 bg-[#1F2937] rounded-xl shadow-md mb-4">
            <div className="markdown-content text-[#F9FAFB]">
              <h1 className={styles.h1}>Interview Jam Session</h1>
            {whom && <h3 className={styles.h3}>with {whom}</h3>}
            </div>
            {questions.length > 0 && question?.category && (
              <div className="p-4 bg-white rounded-lg shadow">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                  <h2 className="text-black"><b>Category:</b> {question?.category.charAt(0).toUpperCase() + question?.category.slice(1)}</h2>
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
            {!isDemo && questions.length > 0 && question?.category &&(
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
                  onChange={(e) => setManualTranscript(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  className="text-white bg-[#10B981] hover:bg-[#059669] disabled:bg-gray-400 py-2 px-4 rounded-md transition-colors"
                  disabled={questions.length < 0 || !manualTranscript.trim() || evaluatingState === 'Evaluating' || isSubmitting}
                  onClick={async () => {
                    setIsSubmitting(true)
                    setEvaluatingState('Evaluating')
                    const answerId = await saveAnswer(question?.id?.toString() || '', manualTranscript)
                    const newVersion = {
                      answerId: answerId.toString(),
                      questionId: question?.id?.toString() || '',
                      transcript: manualTranscript,
                      aiScoringResult: null,
                      audioUrl: '',
                      recordingTimestamp: new Date(),
                    }
                    setVersions(prevVersions => [newVersion, ...prevVersions])
                    await handleAiScoring(answerId, 0)
                  }}
                >
                  {evaluatingState === 'Ready' ? 'Evaluate Answer' : 'Evaluating...'}
              </button>
            </div>
          ) : null }
        </div>
        )}
        {isSubmitting && (
          <div className="text-black my-8">
            <div className="p-4 bg-white rounded-lg shadow animate-pulse">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Evaluating your answer...</h3>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
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
                if (isDemo) {
                  removeDemoData()
                  router.push('/start')
                } else {
                  router.push('/interview-ready')
                }
              }}
              className="w-full bg-[#10B981] text-[#F9FAFB] py-3 rounded-md font-medium hover:bg-[#0e9370] transition-colors"
            >
              {isDemo ? 'Exit Demo' : 'Back'}
            </Button>
          </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function InterviewPractice() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InterviewPracticeContent />
    </Suspense>
  )
}