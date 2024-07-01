import './App.css';
import React, {useState, useRef, useEffect} from 'react';
import DijkstraAlgorithm from './components/DijkstraAlgorithm'
import BFSAlgorithm from './components/BFSAlgorithm'
import DFSAlgorithm from './components/DFSAlgorithm'
import BubbleSortAlgorithm from './components/BubbleSortAlgorithm'
import InsertionSortAlgorithm from './components/InsertionSortAlgorithm'
import SelectionSortAlgorithm from './components/SelectionSortAlgorithm'
const App = () => {
    const [selectedAlgorithm, setSelectedAlgorithm] = useState('Dijkstra');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sortingMovedDown, setSortingMovedDown] = useState(false);
    const [selectedSortingAlgorithm, setSelectedSortingAlgorithm] = useState(''); // State for selected sorting algorithm
    const [sortingDropdownOpen, setSortingDropdownOpen] = useState(false); // State to control dropdown visibility
    const sortingDropdownRef = useRef(null); // Ref for sorting dropdown button
    const dropdownRef = useRef(null);


    const algorithms = ['Dijkstra','BFS','DFS'];

    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
      if (!dropdownOpen) {
        setSortingMovedDown(true); // Move sorting algorithms down when opening graph algorithms dropdown
      } else {
        setSortingMovedDown(false); // Move sorting algorithms back up when closing graph algorithms dropdown
      }
      setSortingDropdownOpen(false); // Close sorting dropdown if open
    };
  
    const handleAlgorithmChange = (algorithm) => {
      setSelectedAlgorithm(algorithm);
      setDropdownOpen(false); // Close graph algorithms dropdown after selection
      setSortingMovedDown(false); // Move sorting algorithms section back up
      console.log(`Selected Algorithm: ${algorithm}`);
    };

    const toggleSortingDropdown = () => {
      setSortingDropdownOpen(!sortingDropdownOpen);
      setSortingMovedDown(false); // Reset sortingMovedDown state when opening sorting dropdown
      setDropdownOpen(false); // Close graph algorithms dropdown if open
    };
    
    const handleSortingAlgorithmChange = (algorithm) => {
      setSelectedAlgorithm(algorithm);
      setSelectedSortingAlgorithm(algorithm); // Set selected sorting algorithm
      setSortingDropdownOpen(false); // Close sorting dropdown after selection
      setSortingMovedDown(false); // Move sorting algorithms section back up
      console.log(`Selected Sorting Algorithm: ${algorithm}`);
    };

useEffect(() => {
    if (dropdownRef.current) {
      const buttonWidth = dropdownRef.current.offsetWidth;
      const dropdownItems = document.getElementsByClassName('dropdown-item');
      for (let item of dropdownItems) {
        item.style.width = `${buttonWidth}px`;
      }
    }
  }, [dropdownOpen]);

console.log(sortingMovedDown);

return (
  <div className="app-container">
    <h1 className="title">Algorithms Visualizer</h1>

    {/* Graph Algorithms Dropdown */}
    <div className="content-container">
      <button onClick={toggleDropdown} className="dropdown-button" ref={dropdownRef}>
        Graph Algorithms
      </button>
      {dropdownOpen && (
        <ul className="dropdown-menu">
          {algorithms.map((algorithm) => (
            <li key={algorithm}>
              <button onClick={() => handleAlgorithmChange(algorithm)} className="dropdown-item">
                {algorithm}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* Sorting Algorithms Dropdown */}
    <div className={`sorting-algorithms-section ${sortingMovedDown ? 'sorting-moved-down' : ''}`}>
      <button onClick={toggleSortingDropdown} className="dropdown-button" ref={sortingDropdownRef}>
        Sorting Algorithms
      </button>

      {sortingDropdownOpen && (
        <ul className="dropdown-menu">
          <li>
            <button onClick={() => handleSortingAlgorithmChange('Bubble Sort')} className="dropdown-item">
              Bubble Sort
            </button>
          </li>
          <li>
            <button onClick={() => handleSortingAlgorithmChange('Insertion Sort')} className="dropdown-item">
              Insertion Sort
            </button>
            <button onClick={() => handleSortingAlgorithmChange('Selection Sort')} className="dropdown-item">
              Selection Sort
            </button>
          </li>
          {/* Add more sorting algorithms as needed */}
        </ul>
      )}

      {/* Selected Algorithm */}
      <div className="selected-algorithm">
        <div className="selected-algorithm-label">Selected Algorithm:</div>
        <div className="selected-algorithm-name">{selectedAlgorithm || 'None'}</div>
      </div>

      <div className="visualization-container">
        {/* Render visualization based on selectedAlgorithm */}
        {selectedAlgorithm === 'Dijkstra' && <DijkstraAlgorithm />}
        {selectedAlgorithm === 'BFS' && <BFSAlgorithm />}
        {selectedAlgorithm === 'DFS' && <DFSAlgorithm />}
        {selectedAlgorithm === 'Bubble Sort' && (
          <div>
                    {selectedAlgorithm === 'Bubble Sort' && <BubbleSortAlgorithm />}
          </div>
        )}
        {selectedAlgorithm === 'Insertion Sort' && (
          <div>
                    {selectedAlgorithm === 'Insertion Sort' && <InsertionSortAlgorithm />}
          </div>
        )}
                {selectedAlgorithm === 'Selection Sort' && (
          <div>
                    {selectedAlgorithm === 'Selection Sort' && <SelectionSortAlgorithm />}
          </div>
        )}
        {/* Add more visualizations as needed */}
      </div>
    </div>
  </div>
);
}
export default App;
