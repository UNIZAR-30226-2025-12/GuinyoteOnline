import React, { useState } from 'react';
import '/src/styles/SearchBar.css';

const SearchBar = ({ handleOnChange }) => {

    const [value, setValue] = React.useState('');

    const onInputChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);

        handleOnChange(newValue);

    };

    return (
        <div className="search-bar">
            <input
                type="text"
                value={value}
                onChange={onInputChange}
                placeholder="Search..."
                autoFocus
            />
        </div>
    );
};

export default SearchBar;