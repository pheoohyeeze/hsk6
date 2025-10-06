import React, { useState, useCallback, useEffect, useRef } from 'react';
import examsList from './constants';
import type { UserAnswers, Exam, Question } from './types';
import ExamView from './components/ExamView';
import ResultsView from './components/ResultsView';
import { getExplanationForQuestion } from './services/geminiService';
import ExplanationModal from './components/ExplanationModal';
import TestSelectionView from './components/TestSelectionView';
import DarkModeToggle from './components/DarkModeToggle';

type ExamStatus = 'SELECTING' | 'IN_PROGRESS' | 'COMPLETED';

const App: React.FC = () => {
  const [examStatus, setExamStatus] = useState<ExamStatus>('SELECTING');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [explanationLoading, setExplanationLoading] = useState(false);
  const [currentQuestionForExplanation, setCurrentQuestionForExplanation] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  // This effect handles loading and playing audio when the listening section begins.
  useEffect(() => {
    if (
      examStatus === 'IN_PROGRESS' &&
      selectedExam &&
      selectedExam.data[currentSectionIndex].title.includes('听力') &&
      audioRef.current
    ) {
      const audioUrl = `/data/audio/${selectedExam.id}.mp3`;
      const audio = audioRef.current;
      
      // Check if the source needs to be updated to avoid reloading.
      if (!audio.src || !audio.src.endsWith(audioUrl)) {
          audio.src = audioUrl;
      }
      
      audio.play().catch(error => {
        console.warn("Audio autoplay was prevented by the browser.", error);
        // The user can manually click the play button on the controls.
      });
    }
  }, [examStatus, selectedExam, currentSectionIndex]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleSubmit = useCallback(() => {
    if (!selectedExam || examStatus !== 'IN_PROGRESS') return;

    let correctAnswers = 0;
    for (const qId in userAnswers) {
      if (selectedExam.answerKey[parseInt(qId)] === userAnswers[parseInt(qId)]) {
        correctAnswers++;
      }
    }
    setScore(correctAnswers);
    setExamStatus('COMPLETED');
    setTimeLeft(null);
    stopAudio();
    window.scrollTo(0, 0);
  }, [selectedExam, userAnswers, examStatus]);

  React.useEffect(() => {
    if (examStatus !== 'IN_PROGRESS' || timeLeft === null) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(t => (t !== null ? t - 1 : null));
    }, 1000);

    return () => clearInterval(timerId);
  }, [examStatus, timeLeft, handleSubmit]);


  const handleSelectExam = (exam: Exam) => {
    setSelectedExam(exam);
    setExamStatus('IN_PROGRESS');
    setCurrentSectionIndex(0);
    setUserAnswers({});
    setScore(0);
    setTimeLeft(exam.duration * 60);
    setAudioError(null);
  };

  const handleBackToSelection = () => {
    setSelectedExam(null);
    setExamStatus('SELECTING');
    setTimeLeft(null);
    stopAudio();
    window.scrollTo(0, 0);
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNextSection = () => {
    if (selectedExam && currentSectionIndex < selectedExam.data.length - 1) {
      if (selectedExam.data[currentSectionIndex].title.includes('听力') && audioRef.current) {
        audioRef.current.pause();
      }
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleRetakeExam = () => {
    if (selectedExam) {
      handleSelectExam(selectedExam);
    }
  }

  const handleShowExplanation = useCallback(async (question: any) => {
    if (!selectedExam) return;
    setCurrentQuestionForExplanation(question);
    setIsModalOpen(true);
    setExplanationLoading(true);
    setExplanation('');
    try {
      const expl = await getExplanationForQuestion(question, selectedExam.answerKey[question.id]);
      setExplanation(expl);
    } catch (error) {
      console.error(error);
      setExplanation('ຂໍອະໄພ, ເກີດຂໍ້ຜິດພາດໃນຂະນະທີ່ສ້າງຄຳອະທິບາຍ.');
    } finally {
      setExplanationLoading(false);
    }
  }, [selectedExam]);

  const renderContent = () => {
    switch (examStatus) {
      case 'IN_PROGRESS':
        if (!selectedExam) return null;
        return (
          <ExamView
            section={selectedExam.data[currentSectionIndex]}
            userAnswers={userAnswers}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNextSection}
            onPrev={handlePrevSection}
            onSubmit={handleSubmit}
            isFirstSection={currentSectionIndex === 0}
            isLastSection={currentSectionIndex === selectedExam.data.length - 1}
            onBackToSelection={handleBackToSelection}
            timeLeft={timeLeft}
          />
        );
      case 'COMPLETED':
         if (!selectedExam) return null;
        return (
          <ResultsView
            exam={selectedExam}
            userAnswers={userAnswers}
            score={score}
            onRetake={handleRetakeExam}
            onShowExplanation={handleShowExplanation}
            onBackToSelection={handleBackToSelection}
          />
        );
      case 'SELECTING':
      default:
        return (
          <TestSelectionView exams={examsList} onSelect={handleSelectExam} />
        );
    }
  };
  
  const isListeningSectionInProgress = examStatus === 'IN_PROGRESS' && selectedExam && selectedExam.data[currentSectionIndex].title.includes('听力');

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
      <header className="bg-white shadow-md dark:bg-dark dark:border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary dark:text-blue-400">ຫົວບົດສອບເສັງຈິງ HSK 6 </h1>
           <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-8">
            {isListeningSectionInProgress && (
              <div className="mb-6 pb-6 border-b dark:border-gray-700">
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">ພາກການຟັງ</h3>
                <audio
                  ref={audioRef}
                  controls
                  className="w-full"
                  onError={() => {
                    const examId = selectedExam?.id;
                    if (examId) {
                      const audioUrl = `/data/audio/${examId}.mp3`;
                      setAudioError(`ບໍ່ສາມາດໂຫຼດໄຟລ໌ສຽງໄດ້: ${audioUrl}. ທ່ານສາມາດສືບຕໍ່ສອບເສັງໂດຍບໍ່ມີສຽງ.`);
                    } else {
                      setAudioError('ບໍ່ສາມາດໂຫຼດໄຟລ໌ສຽງໄດ້. ທ່ານສາມາດສືບຕໍ່ສອບເສັງໂດຍບໍ່ມີສຽງ.');
                    }
                  }}
                >
                  Your browser does not support the audio element.
                </audio>
                {audioError && (
                   <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-semibold text-yellow-700 dark:text-yellow-300">{audioError}</span>
                  </div>
                )}
              </div>
            )}
            {renderContent()}
        </div>
      </main>
      <footer className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
        <p>ຕິດຕາມ TikTok: peilaoshi_ </p>
      </footer>
      {isModalOpen && selectedExam && (
         <ExplanationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          question={currentQuestionForExplanation}
          explanation={explanation}
          isLoading={explanationLoading}
          correctAnswer={selectedExam.answerKey[currentQuestionForExplanation?.id]}
        />
      )}
    </div>
  );
};

export default App;
