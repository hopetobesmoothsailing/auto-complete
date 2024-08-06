import React from 'react';
import AutoComplete from './components/AutoComplete';

// Mock data fetching function
const fetchSuggestions = async (query: string): Promise<string[]> => {
    const mockData = [
        'Apple',
        'Banana',
        'Cherry',
        'Date',
        'Fig',
        'Grape',
        'Kiwi',
        'Lemon',
        'Mango',
        'Nectarine'
    ];
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockData.filter(item => item.toLowerCase().includes(query.toLowerCase())));
        }, 500); // Simulate network delay
    });
};

const App: React.FC = () => {
    return (
        <div className="app">
            <h1>AutoComplete Component</h1>
            <AutoComplete fetchData={fetchSuggestions} />
        </div>
    );
};

export default App;
