import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface VoteInterfaceProps {
    question: string;
    options: { _id: string; text: string }[];
    onVote: (optionId: string) => void;
}

const VoteInterface: React.FC<VoteInterfaceProps> = ({ question, options, onVote }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleSubmit = () => {
        if (selectedOption) {
            onVote(selectedOption);
        }
    };

    return (
        <div className="subtle-card p-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-8 text-gray-900 leading-tight">{question}</h2>
            <div className="space-y-3">
                {options.map((option) => (
                    <div
                        key={option._id}
                        onClick={() => setSelectedOption(option._id)}
                        className={`
              relative p-4 rounded-lg border cursor-pointer transition-all duration-200
              ${selectedOption === option._id
                                ? 'border-black bg-gray-50 ring-1 ring-black'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }
            `}
                    >
                        <div className="flex items-center justify-between">
                            <span className={`font-medium ${selectedOption === option._id ? 'text-black' : 'text-gray-700'}`}>
                                {option.text}
                            </span>
                            <div className={`text-black transition-opacity duration-200 ${selectedOption === option._id ? 'opacity-100' : 'opacity-0'}`}>
                                {selectedOption === option._id && <CheckCircle2 size={20} />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className="btn-primary w-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Submit Vote
            </button>
        </div>
    );
};

export default VoteInterface;
