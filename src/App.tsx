import React, { useState } from 'react';
import Autocomplete, { Option } from './components/Autocomplete';

const App: React.FC = () => {
  const options = [
    { value: 'usd', label: 'USD - United States Dollar' },
    { value: 'eur', label: 'EUR - Euro' },
    { value: 'gbp', label: 'GBP - British Pound Sterling' },
    { value: 'jpy', label: 'JPY - Japanese Yen' },
    { value: 'cad', label: 'CAD - Canadian Dollar' },
    { value: 'aud', label: 'AUD - Australian Dollar' },
    { value: 'chf', label: 'CHF - Swiss Franc' },
    { value: 'cny', label: 'CNY - Chinese Yuan' },
    { value: 'sek', label: 'SEK - Swedish Krona' },
    { value: 'sgd', label: 'SGD - Singapore Dollar' },
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    console.log('Input changed:', inputValue);
  };

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const handleAutocompleteChange = (selected: Option[] | null) => {
    if (selected) {
        setSelectedOptions(selected);
    } else {
        setSelectedOptions([]);
    }
};


  const renderOption = (option: Option) => {
    return <div>{option.label}</div>;
  };

  const asyncSearch = async (query: string) => {
    return new Promise<Option[]>((resolve) => {
      setTimeout(() => {
        const filteredOptions = options.filter(option =>
          option.label.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filteredOptions);
      }, 1000);
    });
  };
  
  

  const [value, setValue] = useState<Option[]>([]);

  return (
    <div className="App">
      <header className="App-header bg-purple-100 text-center h-24 flex flex-col justify-center">
        <h1 className="text-3xl font-bold">Autocomplete Component Example</h1>
        <h5>Created by: Melanie Choi</h5>
      </header>
      <main className="App-main flex justify-center space-x-4 p-4">
        <div className="w-1/2">
          <Autocomplete
            autoLabel="Synchronous Search"
            description="With default display and search on focus"
            options={options}
            onChange={handleAutocompleteChange}
            placeholder="Search..."
            disabled={false}
            loading={false}
            renderOption={renderOption}
            value={value}
            searchMode="local"
            asyncSearch={undefined}
            multiple={false}
            onInputChange={handleInputChange} 
          />
        </div>
        <div className="w-1/2">
          <Autocomplete
            autoLabel="Asynchronous Search"
            description="With description and custom results display"
            options={options}
            onChange={handleAutocompleteChange}
            placeholder="Start typing for results"
            disabled={false}
            loading={false}
            renderOption={renderOption}
            value={value}
            searchMode="async"
            asyncSearch={asyncSearch}
            multiple={false}
            onInputChange={handleInputChange}
          />
        </div>
      </main>
    </div>
  );
};

export default App;