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

                const localVote = localStorage.getItem(`has_voted_${id}`);
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
            console.log('[PollPage] Connecting to socket for poll:', id);
            socket.connect();
            socket.emit('join_poll', id);

            socket.on('update_poll', (updatedPoll: PollData) => {
                console.log('[PollPage] Received update_poll:', updatedPoll);
                setPoll(updatedPoll);
            });

            socket.on('error', (err: { message: string }) => {
                console.error('[PollPage] Socket Error:', err.message);
                if (err.message === 'You have already voted with this email.') {
                    setHasVoted(true);
                    localStorage.setItem(`has_voted_${id}`, 'true');
                    alert(err.message);
                } else if (err.message === 'Already voted') {
                    // Legacy error message handling (server should send the specific email one now)
                    setHasVoted(true);
                    localStorage.setItem(`has_voted_${id}`, 'true');
                    alert("You have already voted.");
                } else {
                    alert(err.message);
                    // Do NOT set hasVoted(true) for other errors so they can try again
                }
            });
        }

        // Log IP for debugging
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => console.log('Current User IP:', data.ip))
            .catch(error => console.error('Error fetching IP:', error));

        return () => {
            console.log('[PollPage] Cleaning up socket listeners');
            socket.off('join_poll');
            socket.off('update_poll');
            socket.off('error');
            socket.disconnect();
        };
    }, [id]);

    const handleVote = (optionId: string, email: string) => {
        if (!id) return;
        console.log('[PollPage] Emitting vote. Poll:', id, 'Option:', optionId, 'Email:', email);
        socket.emit('vote', { pollId: id, optionId, email });
        setHasVoted(true);
        localStorage.setItem(`has_voted_${id}`, 'true');
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
