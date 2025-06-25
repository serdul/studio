
"use client";

import { useState, useMemo, useEffect } from "react";
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { explainQuestionAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { Explanation } from "@/lib/types";
import type { ClassifiedQuestion } from "@/ai/schemas";
import { Loader2, ArrowRight, Sparkles, RotateCcw } from "lucide-react";
import { ExplanationCard } from "./explanation-card";
import { getSubjectIcon } from "@/lib/subject-map";

interface QuizViewProps {
  questions: ClassifiedQuestion[];
  fileName: string;
  onStartOver: () => void;
  onQuestionAnswered: (question: ClassifiedQuestion, isCorrect: boolean) => void;
}

type QuizState = 'answering' | 'loading' | 'showingResult';

export function QuizView({ questions, fileName, onStartOver, onQuestionAnswered }: QuizViewProps) {
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
  const SubjectIcon = getSubjectIcon(currentQuestion.subject);

  useEffect(() => {
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
      const result = await explainQuestionAction(currentQuestion.question);
      setExplanation(result);
      
      const correct = userSelection.startsWith(result.correctAnswer);
      setIsCorrect(correct);
      
      onQuestionAnswered(currentQuestion, correct);

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
      toast({
        title: "Quiz Complete!",
        description: `You scored ${score} out of ${questions.length}. Check the dashboard to see your updated performance.`,
      });
      onStartOver();
    }
  };
  
  const getOptionLabel = (line: string) => {
    const match = line.match(/^([A-Ea-e][\.\)])\s*(.*)/);
    return match ? { value: match[1], label: match[2] } : { value: line, label: line };
  };

  const { questionText, options } = useMemo(() => {
    const lines = currentQuestion.question.split('\n').filter(line => line.trim() !== '');
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
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Quiz: {fileName}</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium p-2 bg-secondary rounded-md">
                <SubjectIcon className="h-4 w-4 text-primary" />
                <span>{currentQuestion.subject}: {currentQuestion.topic}</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
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
            <Button onClick={handleAnswerSubmit} className="bg-accent hover:bg-accent/90">Submit Answer</Button>
          )}
          {quizState === 'loading' && (
            <Button disabled>
              <Loader2 className="animate-spin" />
              AI is Thinking...
            </Button>
          )}
          {quizState === 'showingResult' && (
             <Button onClick={handleNextQuestion} className="bg-green-600 hover:bg-green-700">
                {isCorrect ? <Sparkles className="text-yellow-300" /> : null}
                Next Question <ArrowRight />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
