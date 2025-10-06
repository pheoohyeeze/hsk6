
import React from 'react';
import type { Question } from '../types';

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  explanation: string;
  isLoading: boolean;
  correctAnswer: string;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  question,
  explanation,
  isLoading,
  correctAnswer,
}) => {
  if (!isOpen || !question) return null;
  
  const options = question.options || {};
  const correctAnswerText = options[correctAnswer];


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">AI Explanation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Question {question.id}:</p>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{question.question}</p>
             {correctAnswerText && (
                <p className="mt-3 text-sm text-success dark:text-green-400 font-semibold">
                   ຄຳຕອບທີ່ຖືກຕ້ອງ: {correctAnswer}. {correctAnswerText}
                </p>
            )}
          </div>
          
          <div className="min-h-[150px]">
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-blue-400"></div>
                    <p className="ml-4 text-gray-600 dark:text-gray-300">ກຳລັງສ້າງຄຳອະທິບາຍ...</p>
                </div>
            ) : (
                <div className="space-y-2 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">ຄຳອະທິບາຍ:</p>
                    <p>{explanation}</p>
                </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700 text-right rounded-b-xl">
            <button onClick={onClose} className="bg-primary text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-blue-600 dark:hover:bg-blue-500 transition">
                ປິດ
            </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;