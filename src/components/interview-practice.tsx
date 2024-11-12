'use client';

import AudioRecorder from "@/components/audio-recorder";
import { useState, useEffect } from 'react';
import Scoring from "./scoring";
import { get } from 'idb-keyval';
import { useRouter } from 'next/navigation';

interface Question {
  id: number;
  category: string;
  question: string;
  why: string;
  focus: string;
}

interface ScoringResult {
  contentAndStructure: {
    thesisClarity: number;
    organization: number;
    supportEvidence: number;
    total: number;
  };
  deliveryAndVocalControl: {
    pacingPausing: number;
    volumeClarity: number;
    vocalVariety: number;
    total: number;
  };
  languageUseAndStyle: {
    grammarSyntax: number;
    appropriateness: number;
    wordChoiceRhetoric: number;
    total: number;
  };
  finalScore: number;
}

export default function InterviewPractice() {
  const [versions, setVersions] = useState<Array<{
    transcript: string | null;
    aiScoringResult: ScoringResult | null;
    audioUrl: string;
    recordingTimestamp: Date;
  }>>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [expandedVersionIndex, setExpandedVersionIndex] = useState<number | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const router = useRouter();

  const handleTranscriptionComplete = async (newTranscript: string, newAudioUrl: string) => {
    const versionNumber = getNextVersionNumber();
    const key = `audio_v${versionNumber}`;
    const audioBlob = await get(key);
    newAudioUrl = URL.createObjectURL(audioBlob);

    const newVersion = {
      transcript: newTranscript,
      aiScoringResult: null,
      audioUrl: newAudioUrl,
      recordingTimestamp: new Date(),
    };
    setVersions(prevVersions => [newVersion, ...prevVersions]);
    setExpandedVersionIndex(0); // Expand the newest version
    await handleAiScoring(newTranscript, 0);
  };

  const handleAiScoring = async (transcriptText: string, versionIndex: number) => {
    if (!transcriptText) {
      console.error('No transcript available for scoring.');
      return;
    }

    try {
      const questionId = question?.id;
      const profileId = localStorage.getItem('profileId');
      const response = await fetch('/api/ai-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcription: transcriptText, profileId, questionId }),
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
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`/api/questions?profileId=${profileId}&offset=${offset}`);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        console.log('ZZZ data', data);
        setQuestion(data.question);
        setOffset(data.offset);
      } catch (error) {
        console.error('Error fetching questions response:', error);
        }
    }
    if (offset !== -1) {
      fetchQuestions();
    }
  }, [versions.length, questionIndex]);

  // Add this function to get the next version number
  const getNextVersionNumber = () => versions.length + 1;

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1f2b]">
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="mt-6 text-3xl font-bold text-white">Interview Prep for Product Manager</h2>
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-black mb-4"><b>Category:</b> {question?.category} Question</h2>
          <h3 className="text-sm text-black mb-4">
            <b>Question:</b> {question?.question}
          </h3>
          <h3 className="text-sm text-black mb-4">
            <b>Why:</b> {question?.why}
        </h3>
          <h3 className="text-sm text-black mb-4">
            <b>Focus:</b> {question?.focus}
          </h3>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <AudioRecorder
              onTranscriptionComplete={handleTranscriptionComplete}
              version={getNextVersionNumber()}
            />
            <button
              className="text-white bg-[#7C3AED] hover:bg-[#4338CA] disabled:bg-gray-400 py-2 px-4 rounded-md transition-colors"
              disabled={offset === -1}
              onClick={() => {
                setQuestionIndex(questionIndex + 1);
              }}
            >
              Next Question
            </button>        
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
          </div>
        </div>

        {versions.map((version, index) => (
          <div key={version.recordingTimestamp.toISOString()}>
            {showDebug && version.aiScoringResult && (
              <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Raw AI Scoring Result (Version {versions.length - index}):</h2>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  {JSON.stringify(version.aiScoringResult, null, 2)}
                </pre>
              </div>
            )}
            {version.aiScoringResult && (
              <Scoring
                averageScore={version.aiScoringResult.finalScore}
                definedRound={`AI Evaluation (Version ${versions.length - index})`}
                categories={[
                  {
                    name: 'Content & Structure',
                    score: version.aiScoringResult.contentAndStructure.total,
                    subcategories: [
                      { name: 'Thesis & Message Clarity', score: version.aiScoringResult.contentAndStructure.thesisClarity },
                      { name: 'Organization', score: version.aiScoringResult.contentAndStructure.organization },
                      { name: 'Support & Evidence', score: version.aiScoringResult.contentAndStructure.supportEvidence },
                    ],
                  },
                  {
                    name: 'Delivery & Vocal Control',
                    score: version.aiScoringResult.deliveryAndVocalControl.total,
                    subcategories: [
                      { name: 'Pacing & Pausing', score: version.aiScoringResult.deliveryAndVocalControl.pacingPausing },
                      { name: 'Volume & Clarity', score: version.aiScoringResult.deliveryAndVocalControl.volumeClarity },
                      { name: 'Vocal Variety', score: version.aiScoringResult.deliveryAndVocalControl.vocalVariety },
                    ],
                  },
                  {
                    name: 'Language Use & Style',
                    score: version.aiScoringResult.languageUseAndStyle.total,
                    subcategories: [
                      { name: 'Grammar & Syntax', score: version.aiScoringResult.languageUseAndStyle.grammarSyntax },
                      { name: 'Appropriateness', score: version.aiScoringResult.languageUseAndStyle.appropriateness },
                      { name: 'Word Choice & Rhetoric', score: version.aiScoringResult.languageUseAndStyle.wordChoiceRhetoric },
                    ],
                  },
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
    </div>
  )
}