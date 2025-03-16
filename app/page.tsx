"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, ArrowRight, RotateCcw, ChevronLeft } from "lucide-react"
import { fetchRandomWords } from "@/lib/words"
import LearnCard from "@/components/learn-card"
import QuizCard from "@/components/quiz-card"
import QuizResults from "@/components/quiz-results"

export default function VocabularyApp() {
  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mode, setMode] = useState("learn")
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizType, setQuizType] = useState("indonesian") // "indonesian" or "english"
  const [loading, setLoading] = useState(true)

  const loadWords = async () => {
    setLoading(true)
    // Simplified: just fetch random words without tracking viewed words
    const randomWords = await fetchRandomWords(10)
    setWords(randomWords)
    setCurrentIndex(0)
    setLoading(false)
  }

  useEffect(() => {
    loadWords()
  }, [])

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleReset = () => {
    // Fixed: Reset words by fetching new ones directly
    loadWords()
    setQuizStarted(false)
    setQuizCompleted(false)
    setQuizAnswers({})
  }

  const startQuiz = (type) => {
    setQuizType(type)
    setQuizStarted(true)
    setQuizAnswers({})
    setQuizCompleted(false)
    setCurrentIndex(0)
  }

  const backToQuizOptions = () => {
    setQuizStarted(false)
    setQuizCompleted(false)
  }

  const handleQuizAnswer = (wordId, answer) => {
    setQuizAnswers({
      ...quizAnswers,
      [wordId]: answer,
    })
  }

  const submitQuiz = () => {
    setQuizCompleted(true)
  }

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      handleNext()
    } else if (e.key === "ArrowLeft") {
      handlePrevious()
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [currentIndex])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading vocabulary...</p>
      </div>
    )
  }

  const currentWord = words[currentIndex]

  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-6">Belajar Kosakata Bahasa Inggris</h1>

      <Tabs defaultValue="learn" value={mode} onValueChange={setMode}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="learn">Learn</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="learn">
          {currentWord && <LearnCard word={currentWord} onSwipeLeft={handlePrevious} onSwipeRight={handleNext} />}

          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            <Button variant="outline" onClick={handleNext} disabled={currentIndex === words.length - 1}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {words.length}
            </span>
          </div>
        </TabsContent>

        <TabsContent value="quiz">
          {!quizStarted && !quizCompleted && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Choose Quiz Type</h2>
                <div className="space-y-4">
                  <Button className="w-full" onClick={() => startQuiz("indonesian")}>
                    English to Indonesian
                  </Button>
                  <Button className="w-full" onClick={() => startQuiz("english")}>
                    Indonesian to English
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {quizStarted && !quizCompleted && currentWord && (
            <>
              {/* Added: Back to Quiz Options button */}
              <div className="mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={backToQuizOptions}
                  className="flex items-center text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Quiz Options
                </Button>
              </div>

              <QuizCard
                word={currentWord}
                quizType={quizType}
                onAnswer={(answer) => handleQuizAnswer(currentWord.id, answer)}
                answer={quizAnswers[currentWord.id] || ""}
                onSwipeLeft={handlePrevious}
                onSwipeRight={handleNext}
              />

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevious} disabled={currentIndex === 0}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                {currentIndex === words.length - 1 ? (
                  <Button onClick={submitQuiz}>Submit Quiz</Button>
                ) : (
                  <Button variant="outline" onClick={handleNext}>
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="text-center mt-4">
                <span className="text-sm text-muted-foreground">
                  {currentIndex + 1} of {words.length}
                </span>
              </div>
            </>
          )}

          {quizCompleted && (
            <QuizResults words={words} answers={quizAnswers} quizType={quizType} onRestart={backToQuizOptions} />
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" /> Reset Words
        </Button>
      </div>
    </div>
  )
}

