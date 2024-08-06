import React, { useState, useEffect, useRef } from 'react';

// TypeScript interfaces
interface AutoCompleteProps {
    fetchData: (query: string) => Promise<string[]>;
}

interface HighlightProps {
    text: string;
    highlight: string;
}

const HighlightText: React.FC<HighlightProps> = ({ text, highlight }) => {
    if (!highlight.trim()) {
        return <>{text}</>;
    }

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

    return (
        <>
            {parts.map((part, index) =>
                part.toLowerCase() === highlight.toLowerCase() ? (
                    <mark key={index}>{part}</mark>
                ) : (
                    part
                )
            )}
        </>
    );
};

const AutoComplete: React.FC<AutoCompleteProps> = ({ fetchData }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Fetch suggestions based on the query
    useEffect(() => {
        if (query.length > 1) {
            const fetchSuggestions = async () => {
                const data = await fetchData(query);
                setSuggestions(data);
                setIsOpen(true);
            };

            fetchSuggestions();
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    }, [query, fetchData]);

    // Handle key events for navigating suggestions
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (event.key === 'ArrowUp') {
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (event.key === 'Enter' && selectedIndex >= 0) {
            setQuery(suggestions[selectedIndex]);
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    // Handle selection of a suggestion
    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setSuggestions([]);
        setIsOpen(false);
    };

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="autocomplete">
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type to search..."
            />
            {isOpen && suggestions.length > 0 && (
                <ul className="suggestions">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className={index === selectedIndex ? 'selected' : ''}
                            onClick={() => handleSuggestionClick(suggestion)}
                        >
                            <HighlightText text={suggestion} highlight={query} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutoComplete;
