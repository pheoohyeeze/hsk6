import React from 'react';
import type { Section, UserAnswers } from '../types';
import QuestionCard from './QuestionCard';

interface ExamViewProps {
  section: Section;
  userAnswers: UserAnswers;
  onAnswerSelect: (questionId: number, answer: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isFirstSection: boolean;
  isLastSection: boolean;
  onBackToSelection: () => void;
  timeLeft: number | null;
}

const ExamView: React.FC<ExamViewProps> = ({
  section,
  userAnswers,
  onAnswerSelect,
  onNext,
  onPrev,
  onSubmit,
  isFirstSection,
  isLastSection,
  onBackToSelection,
  timeLeft,
}) => {
  const handleBack = () => {
    if (window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການກັບໄປໜ້າເລືອກຊຸດທົດສອບ? ຄວາມຄືບໜ້າຂອງທ່ານຈະຖືກລົບ.')) {
      onBackToSelection();
    }
  };

  const formatTime = (seconds: number | null): string => {
    if (seconds === null || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  const isTimeLow = timeLeft !== null && timeLeft < 300; // 5 minutes

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-start mb-4 pb-4 border-b dark:border-gray-700">
          <button
            onClick={handleBack}
            className="text-secondary dark:text-gray-400 hover:text-primary dark:hover:text-blue-400 font-semibold transition duration-300 flex items-center"
            aria-label="Back to test selection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            ກັບໄປໜ້າເລືອກຊຸດທົດສອບ
          </button>
          <div className={`text-xl md:text-2xl font-bold flex items-center gap-2 ${isTimeLow ? 'text-danger dark:text-red-400' : 'text-primary dark:text-blue-400'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-dark dark:text-gray-100">{section.title}</h2>
        <p className="text-lg text-secondary dark:text-gray-400">{section.subtitle}</p>
      </div>

      {section.parts.map((part, index) => (
        <div key={index} className="border-t pt-6 dark:border-gray-700">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{part.title}</h3>
          <p className="text-md text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-wrap">{part.instructions}</p>
          {part.passage && <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{part.passage}</div>}
          <div className="space-y-6">
            {part.questions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                userAnswer={userAnswers[q.id]}
                onAnswerSelect={onAnswerSelect}
              />
            ))}
          </div>
        </div>
      ))}
      
      <div className="flex justify-between items-center mt-8 pt-6 border-t dark:border-gray-700">
        <button
          onClick={onPrev}
          disabled={isFirstSection}
          className="bg-secondary text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-gray-600 dark:hover:bg-gray-500 transition duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          ຍ້ອນກັບ
        </button>
        {isLastSection ? (
          <button
            onClick={onSubmit}
            className="bg-success text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-green-600 dark:hover:bg-green-500 transition duration-300"
          >
            ສົ່ງຄຳຕອບ
          </button>
        ) : (
          <button
            onClick={onNext}
            className="bg-primary text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 dark:hover:bg-blue-500 transition duration-300"
          >
            ຕໍ່ໄປ
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamView;
