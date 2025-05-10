"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';

const SimpleForm: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Submitted Value:', inputValue);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter something"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default SimpleForm;
