export type QuestionType = {
  id: string
  question_text: string
  upvote: number
  downvote: number
  response1: ResponseType
  response2: ResponseType
}

export type ResponseType = {
  response_text: string
  choice: number
}
