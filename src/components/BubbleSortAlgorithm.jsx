import React, { useState, useEffect } from 'react';
import './BubbleSortVisualizer.css'; // Import your CSS file

const BubbleSortVisualizer = () => {
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

  // Bubble Sort algorithm
  const bubbleSort = async () => {
    setIsSorting(true);
    const newArray = [...array];
    const n = newArray.length;
    let swapped;

    do {
      swapped = false;
      for (let i = 0; i < n - 1; i++) {
        setHighlightedIndex(i); // Highlight current element being compared
        await new Promise((resolve) => setTimeout(resolve, 30)); // Delay for visualization

        if (newArray[i] > newArray[i + 1]) {
          // Swap elements
          let temp = newArray[i];
          newArray[i] = newArray[i + 1];
          newArray[i + 1] = temp;
          swapped = true;

          // Update state to trigger re-render
          setArray([...newArray]);
        }
      }
      setHighlightedIndex(null); // Clear highlight after each pass
    } while (swapped);

    setIsSorting(false);
  };

  // Initialize array on component mount
  useEffect(() => {
    setArray(generateRandomArray(arraySize)); // Initialize array with default size
  }, [arraySize]);

  return (
    <div className="bubble-sort-visualizer">
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
        <button onClick={bubbleSort} disabled={isSorting}>
          {isSorting ? 'Sorting...' : 'Sort Using Bubble Sort'}
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

export default BubbleSortVisualizer;
