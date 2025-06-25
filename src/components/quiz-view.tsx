
"use client";

import { useState, useMemo, useEffect } from "react";
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { explainQuestionAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { Explanation } from "@/lib/types";
import { Loader2, ArrowRight, Sparkles, RotateCcw } from "lucide-react";
import { ExplanationCard } from "./explanation-card";

interface QuizViewProps {
  questions: string[];
  fileName: string;
  onStartOver: () => void;
}

type QuizState = 'answering' | 'loading' | 'showingResult';

export function QuizView({ questions, fileName, onStartOver }: QuizViewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>('answering');
  const [userSelection, setUserSelection] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const { toast } = useToast();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

  useEffect(() => {
    // Reset state for new question
    setQuizState('answering');
    setUserSelection(null);
    setExplanation(null);
    setIsCorrect(null);
    setShowConfetti(false);
  }, [currentQuestionIndex]);

  const handleAnswerSubmit = async () => {
    if (!userSelection) {
      toast({
        variant: "destructive",
        title: "No Answer Selected",
        description: "Please select an answer before submitting.",
      });
      return;
    }

    setQuizState('loading');
    try {
      const result = await explainQuestionAction(currentQuestion);
      setExplanation(result);
      
      const correct = userSelection.startsWith(result.correctAnswer);
      setIsCorrect(correct);
      
      if (correct) {
        setScore(s => s + 1);
        setShowConfetti(true);
      }
      
      setQuizState('showingResult');
    } catch (error: any) {
      console.error("Error explaining question:", error);
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: error.message || "The AI could not explain this question.",
      });
      setQuizState('answering');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      // End of quiz
      toast({
        title: "Quiz Complete!",
        description: `You scored ${score} out of ${questions.length}.`,
      });
      onStartOver();
    }
  };
  
  const getOptionLabel = (line: string) => {
    const match = line.match(/^([A-Ea-e][\.\)])\s*(.*)/);
    return match ? { value: match[1], label: match[2] } : { value: line, label: line };
  };

  const { questionText, options } = useMemo(() => {
    const lines = currentQuestion.split('\n').filter(line => line.trim() !== '');
    const questionLines = [];
    const optionLines = [];
    let optionsStarted = false;
    for (const line of lines) {
        if (/^[A-Ea-e][\.\)]/.test(line.trim())) {
            optionsStarted = true;
        }
        if (optionsStarted) {
            optionLines.push(line.trim());
        } else {
            questionLines.push(line.trim());
        }
    }
    return { questionText: questionLines.join('\n'), options: optionLines };
  }, [currentQuestion]);


  return (
    <div className="w-full max-w-4xl mx-auto">
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      <Card>
        <CardHeader>
          <CardTitle>Quiz: {fileName}</CardTitle>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="font-bold text-primary">Score: {score}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg whitespace-pre-wrap">{questionText}</p>
          
          <RadioGroup 
            value={userSelection ?? undefined} 
            onValueChange={setUserSelection}
            disabled={quizState !== 'answering'}
          >
            <div className="space-y-2">
              {options.map((line, index) => {
                const { value, label } = getOptionLabel(line);
                const isSelected = userSelection === value;
                const isTheCorrectAnswer = explanation?.correctAnswer && value.startsWith(explanation.correctAnswer);

                let itemClass = "";
                if (quizState === 'showingResult') {
                    if (isTheCorrectAnswer) {
                        itemClass = "bg-green-100 dark:bg-green-900 border-green-500";
                    } else if (isSelected && !isTheCorrectAnswer) {
                        itemClass = "bg-red-100 dark:bg-red-900 border-red-500";
                    }
                }
                
                return (
                  <Label 
                    key={index} 
                    htmlFor={`option-${index}`}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${itemClass} ${isSelected && quizState === 'answering' ? 'border-primary' : 'border-border'}`}
                  >
                    <RadioGroupItem value={value} id={`option-${index}`} />
                    <span>{label}</span>
                  </Label>
                )
              })}
            </div>
          </RadioGroup>

          {quizState === 'showingResult' && explanation && (
            <ExplanationCard explanation={explanation} />
          )}

        </CardContent>
        <CardFooter className="flex justify-between">
           <Button variant="outline" onClick={onStartOver}>
            <RotateCcw /> Start Over
          </Button>
          {quizState === 'answering' && (
            <Button onClick={handleAnswerSubmit}>Submit Answer</Button>
          )}
          {quizState === 'loading' && (
            <Button disabled>
              <Loader2 className="animate-spin" />
              AI is Thinking...
            </Button>
          )}
          {quizState === 'showingResult' && (
             <Button onClick={handleNextQuestion} className="bg-green-600 hover:bg-green-700">
                {isCorrect ? <Sparkles /> : null}
                Next Question <ArrowRight />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
