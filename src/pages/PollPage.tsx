import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPoll } from '../api';
import { socket } from '../socket';
import VoteInterface from '../components/VoteInterface';
import ResultsView from '../components/ResultsView';

interface PollData {
    _id: string;
    question: string;
    options: { _id: string; text: string; votes: number }[];
}

const PollPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [poll, setPoll] = useState<PollData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [hasVoted, setHasVoted] = useState(false);

    useEffect(() => {
        const fetchPoll = async () => {
            try {
                if (!id) return;
                const data = await getPoll(id);
                setPoll(data);

                const localVote = localStorage.getItem(`voted_${id}`);
                if (localVote) {
                    setHasVoted(true);
                }
            } catch (err) {
                setError('Poll not found or server error.');
            } finally {
                setLoading(false);
            }
        };

        fetchPoll();

        if (id) {
            socket.connect();
            socket.emit('join_poll', id);

            socket.on('update_poll', (updatedPoll: PollData) => {
                setPoll(updatedPoll);
            });

            socket.on('error', (err: { message: string }) => {
                alert(err.message);
            });
        }

        return () => {
            socket.off('join_poll');
            socket.off('update_poll');
            socket.off('error');
            socket.disconnect();
        };
    }, [id]);

    const handleVote = (optionId: string) => {
        if (!id) return;
        socket.emit('vote', { pollId: id, optionId });
        setHasVoted(true);
        localStorage.setItem(`voted_${id}`, 'true');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-500 font-semibold text-lg">
            {error}
        </div>
    );

    if (!poll) return null;

    const totalVotes = poll.options.reduce((acc, curr) => acc + curr.votes, 0);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl animate-fade-in">
                {hasVoted ? (
                    <ResultsView question={poll.question} options={poll.options} totalVotes={totalVotes} />
                ) : (
                    <VoteInterface
                        question={poll.question}
                        options={poll.options}
                        onVote={handleVote}
                    />
                )}
            </div>
        </div>
    );
};

export default PollPage;
