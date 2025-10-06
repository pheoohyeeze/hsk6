
import React from 'react';
import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  userAnswer?: string;
  onAnswerSelect?: (questionId: number, answer: string) => void;
  isReviewMode?: boolean;
  onShowExplanation?: (question: Question) => void;
  answerKey?: { [key: number]: string };
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  onAnswerSelect,
  isReviewMode = false,
  onShowExplanation,
  answerKey,
}) => {
  const renderOptions = () => {
    if (!question.options) return null;
    
    const correctAnswer = isReviewMode && answerKey ? answerKey[question.id] : undefined;
    const isCorrect = userAnswer === correctAnswer;

    return Object.entries(question.options).map(([key, value]) => {
      let buttonClass = 'border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600';
      if (!isReviewMode) {
        if (userAnswer === key) {
          buttonClass = 'border-primary dark:border-blue-500 bg-blue-100 dark:bg-blue-900/50 text-primary dark:text-blue-300';
        }
      } else {
        if (key === correctAnswer) {
          buttonClass = 'border-success dark:border-green-500 bg-green-100 dark:bg-green-900/50 text-success dark:text-green-300';
        } else if (key === userAnswer && !isCorrect) {
          buttonClass = 'border-danger dark:border-red-500 bg-red-100 dark:bg-red-900/50 text-danger dark:text-red-300';
        }
      }

      return (
        <button
          key={key}
          onClick={() => onAnswerSelect && onAnswerSelect(question.id, key)}
          disabled={isReviewMode}
          className={`w-full text-left p-3 border rounded-lg transition duration-200 ${buttonClass} disabled:cursor-default disabled:hover:bg-transparent dark:disabled:hover:bg-transparent`}
        >
          <span className="font-semibold mr-2">{key}.</span>
          {value}
        </button>
      );
    });
  };

  const renderWritingInput = () => {
    return (
        <textarea
            rows={10}
            placeholder={question.question}
            value={userAnswer || ''}
            onChange={(e) => onAnswerSelect && onAnswerSelect(question.id, e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition dark:bg-gray-600 dark:text-white dark:placeholder-gray-400 dark:border-gray-500"
            disabled={isReviewMode}
        />
    );
  };
  
  const correctAnswer = isReviewMode && answerKey ? answerKey[question.id] : undefined;
  const isCorrect = userAnswer === correctAnswer;

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
      <div className="flex justify-between items-start mb-4">
          <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{question.question}</p>
          {isReviewMode && question.type !== 'writing' && (
             <span className={`px-3 py-1 text-sm font-bold rounded-full text-white ${isCorrect ? 'bg-success' : 'bg-danger'}`}>
                {isCorrect ? 'ຖືກຕ້ອງ' : 'ຜິດ'}
            </span>
          )}
      </div>

      <div className="space-y-3">
        {question.type === 'writing' ? renderWritingInput() : renderOptions()}
      </div>

      {isReviewMode && userAnswer && !isCorrect && question.type !== 'writing' && (
         <p className="mt-3 text-sm text-success dark:text-green-400">ຄຳຕອບທີ່ຖືກຕ້ອງ: {correctAnswer}</p>
      )}

      {isReviewMode && onShowExplanation && question.type !== 'writing' && (
        <div className="mt-4 text-right">
            <button 
                onClick={() => onShowExplanation(question)}
                className="text-sm text-primary hover:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
                ເບິ່ງຄຳອະທິບາຍຈາກ AI
            </button>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;