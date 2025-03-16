"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"
import { useDrag } from "@/hooks/use-drag"

export default function QuizCard({ word, quizType, onAnswer, answer, onSwipeLeft, onSwipeRight }) {
  const { handlers, style } = useDrag({
    onSwipeLeft,
    onSwipeRight,
  })
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleInputChange = (e) => {
    onAnswer(e.target.value)
  }

  const speakWord = () => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      // Speak the word in the appropriate language
      const textToSpeak = quizType === "indonesian" ? word.english : word.indonesian
      const lang = quizType === "indonesian" ? "en-US" : "id-ID"

      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.lang = lang
      utterance.rate = 0.9

      setIsSpeaking(true)

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div {...handlers}>
      <Card className="w-full transition-transform" style={style}>
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center space-y-6">
            {quizType === "indonesian" ? (
              <>
                {/* Text to Speech Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full ${isSpeaking ? "bg-primary/20" : ""}`}
                  onClick={speakWord}
                  aria-label="Speak word"
                >
                  <Volume2
                    className={`h-5 w-5 ${isSpeaking ? "text-primary animate-pulse" : "text-muted-foreground"}`}
                  />
                </Button>

                {/* English Word */}
                <h2 className="text-3xl font-bold text-center">{word.english}</h2>

                {/* Pronunciation - now centered */}
                <p className="text-sm text-muted-foreground text-center">/{word.pronunciation}/</p>

                {/* Indonesian Translation Input */}
                <div className="w-full">
                  <label className="block text-sm font-medium mb-2">Terjemahan Bahasa Indonesia:</label>
                  <Input
                    type="text"
                    value={answer}
                    onChange={handleInputChange}
                    placeholder="Ketik terjemahan di sini..."
                    className="w-full"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Text to Speech Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full ${isSpeaking ? "bg-primary/20" : ""}`}
                  onClick={speakWord}
                  aria-label="Speak word"
                >
                  <Volume2
                    className={`h-5 w-5 ${isSpeaking ? "text-primary animate-pulse" : "text-muted-foreground"}`}
                  />
                </Button>

                {/* Indonesian Word */}
                <h2 className="text-3xl font-bold text-center">{word.indonesian}</h2>

                {/* English Translation Input */}
                <div className="w-full">
                  <label className="block text-sm font-medium mb-2">English Translation:</label>
                  <Input
                    type="text"
                    value={answer}
                    onChange={handleInputChange}
                    placeholder="Type translation here..."
                    className="w-full"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

