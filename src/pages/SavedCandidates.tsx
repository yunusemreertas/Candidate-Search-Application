import React, { useEffect, useState } from 'react';
import { Candidate } from '../interfaces/Candidate.interface';

const SavedCandidates: React.FC = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [message, setMessage] = useState<string>('Loading saved users...');

  useEffect(() => {
    const loadSavedCandidates = () => {
      try {
        const candidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
        if (candidates.length > 0) {
          setSavedCandidates(candidates);
          setMessage('');
        } else {
          setMessage('No users saved yet.');
        }
      } catch (e) {
        console.error('Error loading saved candidates:', e);
        setMessage('Failed to load saved users.');
      }
    };

    loadSavedCandidates();
  }, []);

  const removeCandidate = (candidateId: number) => {
    try {
      const updatedCandidates = savedCandidates.filter((candidate) => candidate.id !== candidateId);
      setSavedCandidates(updatedCandidates);
      localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));

      if (updatedCandidates.length === 0) {
        setMessage('No users saved yet.');
      }
    } catch (e) {
      console.error('Error removing candidate:', e);
    }
  };

  return (
    <div>
      <h1>Saved Candidates</h1>
      <div>
        {savedCandidates.length > 0 ? (
          savedCandidates.map((candidate) => (
            <div key={candidate.id} className="saved-candidate">
              <img src={candidate.avatar_url} alt={`${candidate.name}'s avatar`} className="saved-candidate-avatar" />
              <div>
                <h2>{candidate.name}</h2>
                <p>
                  <a href={candidate.html_url} target="_blank" rel="noopener noreferrer">
                    View GitHub Profile
                  </a>
                </p>
                <p>{candidate.location || 'Unknown location'}</p>
                <button onClick={() => removeCandidate(candidate.id)} className="remove-button">
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>{message}</p>
        )}
      </div>
    </div>
  );
};

export default SavedCandidates;
