import React, { useState, useEffect, useRef } from 'react'
import CircularProgress from "./circular-progress"
import { Separator } from './ui/separator'
import Markdown from 'react-markdown'

interface Category {
  name: string
  score: number
}

interface Feedback {
  category: string;
  text: string;
}

interface EvaluationRatingProps {
  finalScore: number;
  averageScore: number;
  definedRound: string;
  categories: Category[];
  transcript: string | null;
  audioUrl: string;
  recordingTimestamp: Date | null;
  versionNumber: number;
  isExpanded: boolean;
  answerId: string;
  questionId: string;
  question: string;
  onToggle: () => void;
}

export default function Scoring({
  finalScore,
  averageScore,
  definedRound,
  categories,
  transcript,
  audioUrl,
  recordingTimestamp,
  versionNumber,
  isExpanded,
  onToggle,
  answerId,
  questionId,
  question
}: EvaluationRatingProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [feedbackMarkdown, setFeedbackMarkdown] = useState<string>('');
  const [audioError, setAudioError] = useState<string | null>(null);
  const feedbackRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({});
  const hasFetchedRef = useRef(false);
  const [questionText, setQuestionText] = useState<string>(question);

  useEffect(() => {
    const profileId = localStorage.getItem('profileId')
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`/api/feedback?profileId=${profileId}&questionId=${questionId}&answerId=${answerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }

        const data = await response.json();
        setFeedbackMarkdown(data.feedback);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        // Handle error (e.g., show an error message to the user)
      }
    }
    const generateFeedback = async () => {
      const interviewId = localStorage.getItem('interviewId')
      try {
        const response = await fetch('/api/generate-feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profileId, interviewId, answerId, questionId, categories }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }

        const data = await response.json();
        setFeedbackMarkdown(data.feedback);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        // Handle error (e.g., show an error message to the user)
      }
    };

    const isDemo = localStorage.getItem('mode') === 'demo';

    if (isDemo && !hasFetchedRef.current && questionId && answerId) {
      hasFetchedRef.current = true;
      fetchFeedback();
    } else if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      generateFeedback();
    }

    // Initialize refs for each category
    categories.forEach(category => {
      feedbackRefs.current[category.name] = React.createRef<HTMLDivElement>();
    });
  }, [categories, isExpanded]);

  // const overallAverageScore = categories.reduce((sum, category) => sum + category.score, 0) / categories.length;

  // Format the timestamp
  const formattedTimestamp = recordingTimestamp
    ? recordingTimestamp.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    : 'Date not available';

  //to satisfy the type checker
  console.debug('finalScore', finalScore);
  console.debug('definedRound', definedRound);


  // Add this CSS class to your existing styles
  const chevronStyles = {
    base: "h-5 w-5 transform transition-transform duration-200",
    expanded: "rotate-180",
    color: "text-red-500" // This will make the chevron red
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto font-sans my-8">
      <div
        className="flex flex-col gap-2"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <CircularProgress
            progress={Number((averageScore).toFixed(1))}
            size={88}
          />
          <div className="ml-4">
            <h2 className="text-xl md:text-2xl md:font-bold text-gray-800">{`Attempt #${versionNumber}`}</h2>
          </div>
          <div className="ml-auto">
            <svg
              className={`h-5 w-5 transform transition-transform duration-200 text-[#059669] ${
                isExpanded ? 'rotate-180' : ''
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div className="text-gray-600 text-sm">{formattedTimestamp}</div>

        <div className="text-gray-600 text-sm break-words">{questionText}</div>
      </div>

      {isExpanded && (
        <>

          <Separator className="my-8 h-px bg-gray-200" />
          <h2 className="markdown-content">Scoring</h2>

            {categories.map((category, index) => (
              <div key={index} className="flex items-center mb-4">
                <span className="w-1/3 text-sm text-gray-600">{category.name}</span>
                <span className="w-8 text-right mr-3 text-sm font-semibold text-gray-800">
                  {(category.score ?? 0).toFixed(1)}
                </span>
                <div className="flex-grow bg-gray-200 h-5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#10B981] h-full rounded-full"
                    style={{ width: `${(category.score / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}

          {/* Total Score */}
{/*
          <div className="flex items-center justify-between bg-[#10B981] p-4 rounded-lg mt-8 mb-8">
            <span className="font-bold text-lg text-white">Total Score</span>
            <div className="flex items-center">
              <span className="font-bold text-2xl text-white mr-3">{(finalScore ?? 0).toFixed(1)} / 70</span>
            </div>
          </div>
           */}
          <Separator className="my-8 h-px bg-gray-200" />

          {/* Transcript section */}
          {transcript && (
            <div className="markdown-content-on-white mb-8">
              <h2>Transcript</h2>
              <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
                &quot;{transcript}&quot;
              </blockquote>
              {audioUrl && (
                <div className="hidden md:block">
                  <audio
                    key={audioUrl}
                    className="w-full mt-4"
                    controls
                    src={audioUrl}
                    onError={(e) => {
                      const target = e.target as HTMLAudioElement;
                      const errorMessage = `Audio playback error: ${target.error?.message || 'Unknown error'}`;
                      console.error(errorMessage);
                      setAudioError(errorMessage);
                    }}
                  />
                  {audioError && <p className="text-red-500 mt-2">{audioError}</p>}
                </div>
              )}
            </div>
          )}

          <div className="markdown-content-on-white text-black">
            <Markdown>{feedbackMarkdown}</Markdown>
          </div>
{/*
          <div className="text-gray-900">
            <Markdown>{feedbackMarkdown}</Markdown>
          </div>
           */}
          {/* Feedback section */}
          {feedback.length > 0 ? (
            <div className="mt-8">
              <h2 className="font-bold text-3xl text-gray-800 mb-4">Suggestions for Improvement</h2>
              {categories.map((category, index) => {
                const categoryFeedback = feedback.filter(s => s.category === category.name);
                if (categoryFeedback.length === 0) return null;

                return (
                  <div key={index} className="mb-6" ref={feedbackRefs.current[category.name]}>
                    <h4 className="font-semibold text-xl text-gray-700 mb-2">{category.name}</h4>
                    <ul className="list-disc pl-5">
                      {categoryFeedback.map((feedback, fIndex) => (
                        <li key={fIndex} className="text-gray-600 mb-1">{feedback.text}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-8">
              {/* <p className="text-gray-600 text-lg">Great work. No suggestions.</p> */}
            </div>
          )}
        </>
      )}
    </div>
  )
}
