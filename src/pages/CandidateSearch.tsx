import React, { useState, useEffect } from 'react';
import { fetchCandidates, fetchCandidateDetails } from '../api/API';
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch: React.FC = () => {
  const [currentCandidate, setCurrentCandidate] = useState<Candidate | null>(null);
  const [candidateList, setCandidateList] = useState<Candidate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeCandidates = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error before fetching
        const data = await fetchCandidates();
        console.log('Candidate list:', data);

        if (data.length === 0) {
          setError('No candidates found.');
        } else {
          setCandidateList(data);
          setCurrentCandidate(data[0]);
        }
      } catch (e) {
        setError('Failed to load candidate data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    initializeCandidates();
  }, []);

  const saveCandidate = (candidate: Candidate) => {
    try {
      const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      localStorage.setItem('savedCandidates', JSON.stringify([...savedCandidates, candidate]));
    } catch (e) {
      console.error('Error saving candidate:', e);
    }
  };

  const moveToNextCandidate = async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < candidateList.length) {
      try {
        setLoading(true);
        setError(null); // Reset error before fetching
        const nextCandidateDetails = await fetchCandidateDetails(candidateList[nextIndex].login);
        setCurrentCandidate(nextCandidateDetails);
        setCurrentIndex(nextIndex);
      } catch (e) {
        setError('Failed to load candidate details. Please try again later.');
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentCandidate(null);
      setError('No more candidates available.');
    }
  };

  if (loading) return <p>Loading candidates...</p>;
  if (error) return <p>{error}</p>;
  if (!currentCandidate) return <p>No candidates available at the moment.</p>;

  return (
    <div className="candidate-explorer">
      <h1>Candidate Search</h1>
      <div className="candidate-container">
        <img className="candidate-avatar" src={currentCandidate.avatar_url} alt={`${currentCandidate.login}`} />
        <h2>{currentCandidate.name || currentCandidate.login}</h2>
        <p>Location: {currentCandidate.location || 'Unknown'}</p>
        <p>Email: {currentCandidate.email || 'Not available'}</p>
        <p>
          Profile: <a href={currentCandidate.html_url} target="_blank" rel="noopener noreferrer">{currentCandidate.html_url}</a>
        </p>
        <p>Bio: {currentCandidate.bio || 'No bio available'}</p>
        <div className="action-buttons">
          <button onClick={moveToNextCandidate} className="skip-button">
            Skip
          </button>
          <button
            onClick={() => {
              saveCandidate(currentCandidate);
              moveToNextCandidate();
            }}
            className="save-button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateSearch;
