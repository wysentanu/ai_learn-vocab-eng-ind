"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"
import { useDrag } from "@/hooks/use-drag"

export default function LearnCard({ word, onSwipeLeft, onSwipeRight }) {
  const { handlers, style } = useDrag({
    onSwipeLeft,
    onSwipeRight,
  })
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speakWord = () => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(word.english)
      utterance.lang = "en-US"
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
          <div className="flex flex-col items-center space-y-4">
            {/* Text to Speech Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full ${isSpeaking ? "bg-primary/20" : ""}`}
              onClick={speakWord}
              aria-label="Speak word"
            >
              <Volume2 className={`h-5 w-5 ${isSpeaking ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
            </Button>

            {/* English Word */}
            <h2 className="text-3xl font-bold text-center">{word.english}</h2>

            {/* Pronunciation - now centered */}
            <p className="text-sm text-muted-foreground text-center">/{word.pronunciation}/</p>

            {/* Indonesian Translation */}
            <p className="text-xl text-center">{word.indonesian}</p>

            {/* Example Sentence */}
            <div className="mt-4 p-3 bg-muted rounded-md w-full">
              <p className="text-sm italic">{word.example}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

