import React from 'react';
import CreatePollForm from '../components/CreatePollForm';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center bg-gray-50">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl mb-4">
                        Real-Time Polls
                    </h1>
                    <p className="text-lg text-gray-500">
                        Simple, fast, and instant. No signup required.
                    </p>
                </div>

                <CreatePollForm />
            </div>
        </div>
    );
};

export default Home;
