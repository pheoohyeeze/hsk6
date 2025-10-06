
import React from 'react';
import type { Exam } from '../types';

interface TestSelectionViewProps {
  exams: Exam[];
  onSelect: (exam: Exam) => void;
}

const TestSelectionView: React.FC<TestSelectionViewProps> = ({ exams, onSelect }) => {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold text-dark dark:text-gray-100 mb-4">ຍິນດີຕ້ອນຮັບສູ່ການສອບເສັງ HSK 6</h1>
      <p className="text-lg text-secondary dark:text-gray-400 mb-8">ກະລຸນາເລືອກຊຸດທົດສອບເພື່ອເລີ່ມຕົ້ນ. ໂຊກດີ!</p>
      <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
        {exams.map(exam => (
          <button
            key={exam.id}
            onClick={() => onSelect(exam)}
            className="w-full bg-primary text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition duration-300 transform hover:scale-105"
          >
            {exam.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TestSelectionView;