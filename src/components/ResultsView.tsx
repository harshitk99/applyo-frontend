import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ResultsViewProps {
    question: string;
    options: { _id: string; text: string; votes: number }[];
    totalVotes: number;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

const ResultsView: React.FC<ResultsViewProps> = ({ question, options, totalVotes }) => {
    return (
        <div className="subtle-card p-8 animate-fade-in">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{question}</h2>
                <p className="text-gray-500 text-sm">{totalVotes} votes</p>
            </div>

            <div className="h-64 w-full mb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={options} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="text"
                            width={100}
                            tick={{ fontSize: 13, fill: '#374151' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: '#f3f4f6' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={24}>
                            {options.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-4">
                {options.map((option, index) => {
                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                    return (
                        <div key={option._id} className="relative">
                            <div className="flex mb-1 items-center justify-between text-sm">
                                <span className="font-medium text-gray-900">{option.text}</span>
                                <span className="text-gray-500">{percentage}%</span>
                            </div>
                            <div className="overflow-hidden h-2 mb-1 text-xs flex rounded-full bg-gray-100">
                                <div
                                    style={{ width: `${percentage}%`, backgroundColor: COLORS[index % COLORS.length] }}
                                    className="transition-all duration-500 ease-out"
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ResultsView;
