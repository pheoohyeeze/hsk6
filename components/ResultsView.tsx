
import React from 'react';
import type { UserAnswers, Question, Exam } from '../types';
import QuestionCard from './QuestionCard';

interface ResultsViewProps {
  userAnswers: UserAnswers;
  score: number;
  onRetake: () => void;
  onShowExplanation: (question: Question) => void;
  exam: Exam;
  onBackToSelection: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ userAnswers, score, onRetake, onShowExplanation, exam, onBackToSelection }) => {
  const totalQuestions = Object.keys(exam.answerKey).length;
  const percentage = totalQuestions > 0 ? ((score / totalQuestions) * 100).toFixed(1) : 0;

  // HSK 6 Scoring: Listening and Reading have 50 questions each, worth 100 points each (2 points per question).
  const listeningQuestions = exam.data[0].parts.flatMap(p => p.questions);
  const readingQuestions = exam.data[1].parts.flatMap(p => p.questions);

  const listeningScore = listeningQuestions.reduce((acc, q) => {
    if (userAnswers[q.id] && userAnswers[q.id] === exam.answerKey[q.id]) {
      return acc + 2;
    }
    return acc;
  }, 0);

  const readingScore = readingQuestions.reduce((acc, q) => {
    if (userAnswers[q.id] && userAnswers[q.id] === exam.answerKey[q.id]) {
      return acc + 2;
    }
    return acc;
  }, 0);

  const autoGradedTotal = listeningScore + readingScore;
  const passingThreshold = 120; // Official pass is 180/300 (60%). Auto-graded total is 200, so 60% is 120.
  const isPassing = autoGradedTotal >= passingThreshold;

  return (
    <div className="space-y-8">
      <div className="text-center p-6 bg-blue-50 dark:bg-gray-800/50 rounded-lg border border-primary dark:border-blue-500">
        <h2 className="text-3xl font-bold text-dark dark:text-gray-100 mb-2">ສອບເສັງສຳເລັດ!</h2>
        <p className="text-xl text-secondary dark:text-gray-400">ນີ້ແມ່ນຄະແນນຂອງທ່ານສຳລັບ {exam.name}:</p>
        <div className="my-4">
          <span className="text-5xl font-extrabold text-primary dark:text-blue-400">{score}</span>
          <span className="text-2xl text-gray-500 dark:text-gray-400"> / {totalQuestions}</span>
        </div>
        <p className="text-2xl font-semibold text-gray-700 dark:text-gray-300">({percentage}%)</p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
            onClick={onRetake}
            className="bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition duration-300"
            >
            ສອບເສັງໃໝ່
            </button>
             <button
            onClick={onBackToSelection}
            className="bg-secondary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-600 dark:hover:bg-gray-500 transition duration-300"
            >
             ເລືອກຊຸດທົດສອບອື່ນ
            </button>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t dark:border-gray-700">
        <h3 className="text-2xl font-bold mb-2 text-center text-dark dark:text-gray-100">三、成绩报告</h3>
        <p className="text-center text-secondary dark:text-gray-400 mb-4 max-w-xl mx-auto">HSK（六级）成绩报告提供听力、阅读、书写和总分四个分数。总分 180 分为合格。</p>
        
        <div className="max-w-md mx-auto bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner p-4 border dark:border-gray-600">
            <table className="w-full text-center text-gray-700 dark:text-gray-200">
                <thead>
                    <tr className="border-b dark:border-gray-600">
                        <th className="py-2 font-semibold">项目</th>
                        <th className="py-2 font-semibold">满分</th>
                        <th className="py-2 font-semibold">你的分数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b dark:border-gray-600">
                        <td className="py-3">听力</td>
                        <td>100</td>
                        <td>{listeningScore}</td>
                    </tr>
                    <tr className="border-b dark:border-gray-600">
                        <td className="py-3">阅读</td>
                        <td>100</td>
                        <td>{readingScore}</td>
                    </tr>
                    <tr className="border-b dark:border-gray-600">
                        <td className="py-3">书写</td>
                        <td>100</td>
                        <td className="text-sm text-gray-500">人工评分</td>
                    </tr>
                    <tr>
                        <td className="py-3 font-bold">总分</td>
                        <td className="font-bold">300</td>
                        <td className="font-bold">{autoGradedTotal} <span className="text-sm font-normal text-gray-500">(听力+阅读)</span></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div className="text-center mt-4 max-w-md mx-auto">
            <p className={`text-xl font-bold mt-2 ${isPassing ? 'text-success dark:text-green-400' : 'text-danger dark:text-red-400'}`}>
                状态: {isPassing ? '合格' : '不合格'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 px-4">
                *注意: 书写部分需要人工评分。以上合格状态仅根据听力和阅读部分计算 (120分及以上为合格)。官方合格线为总分180分。
            </p>
        </div>
      </div>


      <div>
        <h3 className="text-2xl font-bold mb-4 pt-8 border-t dark:border-gray-700 text-center text-dark dark:text-gray-100">ກວດຄືນຄຳຕອບຂອງທ່ານ </h3>
        <div className="space-y-8">
          {exam.data.map((section, sIndex) => (
            <div key={sIndex}>
              <h4 className="text-2xl font-bold text-dark dark:text-gray-100 mb-2">{section.title}</h4>
              {section.parts.map((part, pIndex) => (
                <div key={pIndex} className="mt-4 space-y-4">
                  <h5 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{part.title}</h5>
                  {part.passage && <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{part.passage}</div>}
                  {part.questions.map(q => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      userAnswer={userAnswers[q.id]}
                      isReviewMode={true}
                      onShowExplanation={onShowExplanation}
                      answerKey={exam.answerKey}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
