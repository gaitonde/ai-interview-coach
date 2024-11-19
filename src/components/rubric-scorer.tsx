import { useState, useEffect } from 'react';
import MarkdownRenderer from './markdown-renderer';

interface RubricScorerProps {
  profileId: string;
  content: string;
  promptKey: string;
  onScoreComplete?: (rubric: string) => void;
}

export function RubricScorer({
  profileId,
  content,
  promptKey,
  onScoreComplete
}: RubricScorerProps) {
  const [rubric, setRubric] = useState<string | null>(null);

  useEffect(() => {
    scorePrepSheet();
  }, [profileId, content]);

  const scorePrepSheet = async () => {
    try {
      const response = await fetch('/api/score-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileId, content, promptKey }),
      });

      if (response.ok) {
        const result = await response.json();
        setRubric(result.rubric);
        onScoreComplete?.(result.rubric);
      }
    } catch (error) {
      console.error('Error scoring prep sheet:', error);
    }
  };

  return rubric ? (
    <div className="p-4 mx-8 mb-8 bg-white rounded-sm shadow">
      <h2 className="text-2xl font-bold text-orange-500 my-4">Rubric Scoring</h2>
      <MarkdownRenderer content={rubric} />
    </div>
  ) : null;
}