import React, { useState, useEffect, useRef } from 'react';
import debounce from '../utils/debounce';
import AsyncSelect from 'react-select/async';
import { MultiValue, ActionMeta } from 'react-select';

export interface Option {
    value: string;
    label: string;
}

interface AutocompleteProps {
    autoLabel: string;
    description: string;
    options: Option[];
    placeholder: string;
    disabled: boolean;
    loading: boolean;
    onChange: (selected: Option[] | null) => void;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    renderOption: (option: Option) => React.ReactNode;
    value: Option[];
    searchMode: 'local' | 'async';
    asyncSearch?: (query: string) => Promise<Option[]>;
    multiple: boolean;
}

const filterOptions = (inputValue: string, options: Option[]) => {
    return options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
};

// Example promise function to fetch options asynchronously
const promiseOptions = (inputValue: string, options: Option[]) =>
    new Promise<Option[]>((resolve) => {
        // Simulating async data fetching with a timeout
        setTimeout(() => {
            // Replace this with your actual data fetching logic
            const filtered = filterOptions(inputValue, options); // Replace with your actual options and filter function
            resolve(filtered);
        }, 500); // Simulating 1 second delay
    });

const Autocomplete: React.FC<AutocompleteProps> = ({
    autoLabel,
    description,
    options,
    placeholder,
    disabled,
    loading,
    onChange,
    renderOption,
    value,
    searchMode,
    asyncSearch,
    multiple,
    onInputChange,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedOptions, setSelectedOptions] = useState<Option[]>(value); // Initialize selectedOptions with the prop value
    const [showDropdown, setShowDropdown] = useState(false); // State to manage dropdown visibility
    const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
    const [notification, setNotification] = useState<string>('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debouncedInputChange = debounce(onInputChange, 300);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        debouncedInputChange(event);

        if (searchMode === 'local') {
            const filtered = filterOptions(value, options);
            setFilteredOptions(filtered);
            setShowDropdown(true);
            // Show dropdown when typing
        }
    };


    const handleOptionSelection = (option: Option) => {
        const isSelected = selectedOptions.some(item => item.value === option.value);

        if (isSelected) {
            // Remove the option from selectedOptions if already selected
            const updatedOptions = selectedOptions.filter(item => item.value !== option.value);
            setSelectedOptions(updatedOptions);
        } else {
            // Add the option to selectedOptions if not already selected
            setSelectedOptions([...selectedOptions, option]);
        }
        // No need to remove option if already selected

        if (selectedOptions.length > 0) {
            multiple = true;
        }
    };

    useEffect(() => {
        // Update input value when selectedOptions change
        const selectedLabels = selectedOptions.map(opt => opt.label);
        setInputValue(selectedLabels.join(', '));
        onChange(selectedOptions); // Notify parent of selected options change
    }, [selectedOptions, onChange]);

    const handleFocus = () => {
        setShowDropdown(true); // Show dropdown when input is focused
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setShowDropdown(false);
        }
    };

    useEffect(() => {
        // Add event listener to handle clicks outside the component
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const loadOptions = (inputValue: string) => {
        return promiseOptions(inputValue, options);
    };

    const handleSubmit = () => {
        if (searchMode === 'local') {
            if (selectedOptions.length > 0) {
                setNotification('Submission successful');
            } else {
                setNotification('Please choose at least 1 option')
            }
            setTimeout(() => {
                setNotification('');
            }, 3000);

        }else if(searchMode==='async'){
            if (selectedOptions.length > 0) {
                setNotification('Submission successful');
            } else {
                setNotification('Please choose at least 1 option');
            }
            setTimeout(() => {
                setNotification('');
            }, 3000);
        }

    }

    return (
        <div className="relative">
            {autoLabel && <div className="mb-2 text-gray-600">{autoLabel}</div>}
            {searchMode === 'local' && <div className="relative" onFocus={handleFocus} ref={wrapperRef}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
                {showDropdown && (<div className="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
                    {filteredOptions.map(option => (
                        <label key={option.value} className="flex items-center p-2 hover:bg-gray-100">
                            <input
                                type="checkbox"
                                tabIndex={0}
                                checked={selectedOptions.some(item => item.value === option.value)}
                                onChange={() => handleOptionSelection(option)}
                                className="mr-2"
                            />
                            {renderOption(option)}
                        </label>
                    ))}
                </div>
                )}


            </div>}
            {searchMode === 'async' && <div className="relative flex items-center">
                <AsyncSelect
                    isMulti
                    cacheOptions
                    loadOptions={loadOptions}
                    className="w-full"
                    placeholder="Start typing for results..."
                    onChange={(newValue: MultiValue<Option>) => {
                        setSelectedOptions([...newValue]);
                    }}
                />

                {loading && <div className="absolute right-0 top-0 mt-2 mr-2 spinner">Loading...</div>}
            </div>}
            {description && <div className="mb-2 text-gray-600">{description}</div>}
            <button
                type="button"
                className="ml-2 p-2 bg-blue-500 text-white rounded"
                onClick={handleSubmit}
            >
                Submit</button>
            {notification && (
                <div className={`mt-2 p-2 ${notification === 'Submission successful' ? 'bg-green-500' : 'bg-red-500'} text-white rounded`}>
                    {notification}
                </div>
            )}
        </div>
    );
};

export default Autocomplete;

export { };