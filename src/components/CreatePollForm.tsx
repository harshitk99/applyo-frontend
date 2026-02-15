import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { createPoll } from '../api';
import { useNavigate } from 'react-router-dom';

const CreatePollForm: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<string[]>(['', '']);
    const [loading, setLoading] = useState(false);
    const [createdPollId, setCreatedPollId] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, '']);
    };

    const removeOption = (index: number) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || options.some(opt => !opt.trim())) {
            alert('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const poll = await createPoll({ question, options });
            setCreatedPollId(poll._id);
        } catch (error) {
            console.error('Failed to create poll', error);
            alert('Failed to create poll');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (createdPollId) {
            const link = `${window.location.origin}/polls/${createdPollId}`;
            navigator.clipboard.writeText(link);
            alert('Link copied to clipboard!');
        }
    };

    if (createdPollId) {
        return (
            <div className="subtle-card max-w-lg mx-auto p-8 animate-slide-up text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="text-green-600 transform rotate-45" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Poll Created!</h2>
                    <p className="text-gray-500 mt-2">Share this link with your audience.</p>
                </div>

                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200 mb-6">
                    <input
                        readOnly
                        value={`${window.location.origin}/polls/${createdPollId}`}
                        className="bg-transparent flex-1 text-sm text-gray-600 outline-none"
                    />
                    <button
                        onClick={copyToClipboard}
                        className="text-sm font-medium text-black hover:text-gray-700"
                    >
                        Copy
                    </button>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate(`/polls/${createdPollId}`)}
                        className="btn-primary w-full"
                    >
                        Go to Poll
                    </button>
                    <button
                        onClick={() => {
                            setCreatedPollId(null);
                            setQuestion('');
                            setOptions(['', '']);
                        }}
                        className="text-sm text-gray-500 hover:text-black"
                    >
                        Create Another Poll
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="subtle-card max-w-lg mx-auto p-8 animate-slide-up">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">New Poll</h2>
                <p className="text-gray-500 text-sm mt-1">Create a poll to gather feedback instantly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Question
                    </label>
                    <input
                        type="text"
                        className="input-field"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="What would you like to ask?"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Options</label>
                    <div className="space-y-3">
                        {options.map((option, index) => (
                            <div key={index} className="flex gap-2 group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                />
                                {options.length > 2 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className="p-3 text-gray-400 hover:text-black rounded-lg transition-colors"
                                        aria-label="Remove option"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={addOption}
                        className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-black font-medium transition-colors"
                    >
                        <Plus size={16} /> Add Option
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full flex justify-center items-center gap-2"
                >
                    {loading ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Create Poll'
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreatePollForm;
