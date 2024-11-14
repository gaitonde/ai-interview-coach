'use client';

import AudioRecorder from "@/components/audio-recorder";
import { useState, useEffect } from 'react';
import Scoring from "./scoring";
import { get } from 'idb-keyval';
import { useRouter } from 'next/navigation';
import { Footer } from "./footer";
import styles from '../styles/interview-practice.module.css';

type EvaluatingState = 'Ready' | 'Evaluating';

interface Question {
  id: number;
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
    if (versions.length > 0) {
      setShowDebug(false);
      setExpandedVersionIndex(0);
    }

    const profileId = localStorage.getItem('profileId');
    
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs?profileId=${profileId}&scope=interviewer`);
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
      } catch (error) {
        console.error('Error fetching questions response:', error);
        }
    }    

    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/questions?profileId=${profileId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
        setQuestion(data[0]);
        setQuestionIndex(0);
      } catch (error) {
        console.error('Error fetching questions response:', error);
        }
    }

    if (!whom) {
      console.log('ZZZ fetching job...');
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
        <div className="w-full max-w-3xl p-6 sm:p-8 sm:space-y-8 bg-[#1F2937] rounded-xl shadow-md">
          <div className="markdown-content text-[#F9FAFB]">
            <h1 className={styles.h1}>Interview Jam Session</h1>
            {whom && <h3 className={styles.h3}>with {whom}</h3>}
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-black"><b>Category:</b> {question?.category} Question</h2>
              <span className="text-black">Question {questionIndex + 1} of {questions.length}</span>
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
          <button
                className="text-white bg-[#7C3AED] hover:bg-[#4338CA] disabled:bg-gray-400 py-2 px-4 rounded-md transition-colors mr-4"
                disabled={questionIndex === 0}
                onClick={() => {
                  const previousIndex = questionIndex - 1;
                  setQuestionIndex(previousIndex);
                  setQuestion(questions[previousIndex]);
                }}
              >
                Previous Question
          </button>

          <button
                className="text-white bg-[#7C3AED] hover:bg-[#4338CA] disabled:bg-gray-400 py-2 px-4 rounded-md transition-colors"
                disabled={questionIndex === questions.length - 1}
                onClick={() => {
                  const nextIndex = questionIndex + 1;
                  setQuestionIndex(nextIndex);
                  setQuestion(questions[nextIndex]);
                }}
              >
                Next Question
          </button>
          
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
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
{/* 
TODO: move these nav buttons somewhere
              <button
                className="text-white bg-[#7C3AED] hover:bg-[#4338CA] py-2 px-4 rounded-md transition-colors"
                onClick={() => {
                  router.push('/job-prep');
                }}
              >
                Job Prep
              </button>
              <button
                className="text-white bg-[#7C3AED] hover:bg-[#4338CA] py-2 px-4 rounded-md transition-colors"
                onClick={() => {
                  router.push('/');
                }}
              >
                Profile Setup
              </button>   
                        */}
            </div>
          ) : (
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
          )}
        </div>
        {versions.map((version, index) => (
        <div key={version.recordingTimestamp.toISOString()}>
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
              questionId={question?.id?.toString() || ''}
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
        </div>  
        </main>
        <Footer />
      </div>
    </>
  );
}
