import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface VoteInterfaceProps {
    question: string;
    options: { _id: string; text: string }[];
    onVote: (optionId: string, email: string) => void;
}

const VoteInterface: React.FC<VoteInterfaceProps> = ({ question, options, onVote }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        console.log('[VoteInterface] Submit clicked. Option:', selectedOption, 'Email:', email);
        if (selectedOption && email) {
            onVote(selectedOption, email);
        } else {
            console.warn('[VoteInterface] Missing fields. Option or Email not set.');
        }
    };

    return (
        <div className="subtle-card p-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 leading-tight">{question}</h2>
            <p className="text-sm text-gray-500 mb-8">Please enter your email to vote.</p>

            <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email to vote"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    required
                />
            </div>

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
                disabled={!selectedOption || !email}
                className="btn-primary w-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Submit Vote
            </button>
        </div>
    );
};

export default VoteInterface;
