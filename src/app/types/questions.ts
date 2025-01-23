export interface Feedback {
  question_id: number
  answer_id: number
  feedback: string
}

export interface Score {
  question_id: number
  answer_id: number
  score: number
  scores: string
}

export interface Answer {
  id: number
  question_id: number
  feedback: Feedback
  score: Score
}
