import React, { useState, useEffect } from 'react';
import './InsertionSortVisualizer.css'; // Import your CSS file

const InsertionSortAlgorithm = () => {
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [arraySize, setArraySize] = useState(20); // Default array size
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  // Function to generate a random array of given size
  const generateRandomArray = (size) => {
    const newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push(Math.floor(Math.random() * 100) + 1); // Generate random numbers between 1 and 100
    }
    return newArray;
  };

  // Function to handle array size change
  const handleArraySizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    setArraySize(newSize);
    setArray(generateRandomArray(newSize));
  };

  // Insertion Sort algorithm
  // Insertion Sort algorithm
  const insertionSort = async () => {
    setIsSorting(true);
    const newArray = [...array];
    const n = newArray.length;

    for (let i = 1; i < n; i++) {
      let key = newArray[i];
      let j = i - 1;

      // Highlight the current element being compared
      setHighlightedIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 100)); // Delay for visualization

      while (j >= 0 && newArray[j] > key) {
        newArray[j + 1] = newArray[j];
        j = j - 1;

        // Update state to trigger re-render
        setArray([...newArray]);
      }
      newArray[j + 1] = key;

      // Update state to trigger re-render
      setArray([...newArray]);
    }

    setIsSorting(false);
    setHighlightedIndex(null); // Clear highlight after sorting is complete
  };

  // Initialize array on component mount
  useEffect(() => {
    setArray(generateRandomArray(arraySize)); // Initialize array with default size
  }, [arraySize]);

  return (
    <div className="Insertion-sort-visualizer">
      <div className="controls">
        <label htmlFor="arraySize">Array Size:</label>
        <div className="slider-info">
          <span>Current Size: {arraySize}</span> {/* Display current array size */}
          <input
            type="range"
            id="arraySize"
            min="1"
            max="40"
            value={arraySize}
            onChange={handleArraySizeChange}
            className="slider"
          />
        </div>
        <button onClick={() => setArray(generateRandomArray(arraySize))}>Generate New Array</button>
        <button onClick={insertionSort} disabled={isSorting}>
          {isSorting ? 'Sorting...' : 'Sort Using Insertion Sort'}
        </button>
      </div>

      <div className="bars-container">
        {array.map((value, index) => (
          <div key={index} className="bar-container">
            <div
              className={`bar ${index === highlightedIndex ? 'highlighted' : ''}`}
              style={{ height: `${value * 3}px` }} // Adjust height for visualization
            >
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsertionSortAlgorithm;
