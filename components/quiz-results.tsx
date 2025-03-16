"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

export default function QuizResults({ words, answers, quizType, onRestart }) {
  const getScore = () => {
    let correct = 0

    words.forEach((word) => {
      const userAnswer = answers[word.id] || ""
      const correctAnswer = quizType === "indonesian" ? word.indonesian : word.english

      // Simple string comparison - in a real app, you might want more sophisticated matching
      if (userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
        correct++
      }
    })

    return {
      correct,
      total: words.length,
      percentage: Math.round((correct / words.length) * 100),
    }
  }

  const score = getScore()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Quiz Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <p className="text-3xl font-bold">
            {score.correct} / {score.total}
          </p>
          <p className="text-lg">{score.percentage}% Correct</p>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="font-medium">Review:</h3>

          {words.map((word) => {
            const userAnswer = answers[word.id] || ""
            const correctAnswer = quizType === "indonesian" ? word.indonesian : word.english
            const isCorrect = userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()

            return (
              <div key={word.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{quizType === "indonesian" ? word.english : word.indonesian}</p>
                    <p className="text-sm text-muted-foreground">Your answer: {userAnswer || "(no answer)"}</p>
                    {!isCorrect && <p className="text-sm">Correct answer: {correctAnswer}</p>}
                  </div>
                  <div>
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <Button className="w-full" onClick={onRestart}>
          Start New Quiz
        </Button>
      </CardContent>
    </Card>
  )
}

