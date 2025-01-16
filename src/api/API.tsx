import { Candidate } from '../interfaces/Candidate.interface';

const fetchCandidates = async (): Promise<Candidate[]> => {
  try {
    const startIndex = Math.floor(Math.random() * 100000000) + 1;
    console.log('Fetching candidates starting from:', startIndex);

    const response = await fetch(
      `https://api.github.com/users?since=${startIndex}`,
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    console.log('Fetched candidates:', data);

    return data;
  } catch (err) {
    console.error('Error fetching candidates:', err);
    return [];
  }
};

const fetchCandidateDetails = async (username: string): Promise<Candidate> => {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    console.log(`Fetched candidate details for ${username}:`, data);

    return data;
  } catch (error) {
    console.error('Error fetching candidate details:', error);
    throw error;
  }
};

export { fetchCandidates, fetchCandidateDetails };
