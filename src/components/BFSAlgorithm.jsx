import React, { useState} from 'react';
import './BFSVisualizer.css';

const BFSAlgorithm = () => {
  const [selectedNode, setSelectedNode] = useState(new Set());
  const [visitedEdges, setVisitedEdges] = useState(new Set());
  const [visitedNode, setVisitedNodes] = useState(new Set());
  const [nodes, setNodes] = useState([]);
  const [adjacencyList, setAdjacencyList] = useState({});
  const [path, setPath] = useState([]);
  
  const initializeGraph = (numNodes) => {
    const newNodes = [];
    const newAdjacencyList = {};
    const connectionProbability = 0.2;
    const nodeRadius = 30;

    // Generating the nodes, making sure they don't overlap
    for (let i = 1; i <= numNodes; i++) {
      let x, y, valid;
  
      do {
        x = Math.random() * 950;
        y = Math.random() * 950;
        valid = true;
  
        // Overlapping check
        for (const node of newNodes) {
          const dx = node.x - x;
          const dy = node.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < nodeRadius * 2) {
            valid = false;
            break;
          }
        }
      } while (!valid);
  
      newNodes.push({ id: i, x, y });
      newAdjacencyList[i] = {};
    }



    for (let i = 1; i <= numNodes; i++) {
      for (let j = i + 1; j <= numNodes; j++) {
        if (Math.random() < connectionProbability) {
          const nodeA = newNodes[i - 1];
          const nodeB = newNodes[j - 1];
          const distance = Math.sqrt((nodeA.x - nodeB.x) ** 2 + (nodeA.y - nodeB.y) ** 2);
          newAdjacencyList[i][j] = distance;
          newAdjacencyList[j][i] = distance;
        }
      }
    }
  
    setVisitedNodes(new Set());
    setNodes(newNodes);
    setAdjacencyList(newAdjacencyList);
  };


console.log(adjacencyList);

const runBFS = (startNode) => {
  const visited = new Set();
  const queue = [];
  const bfsPath = [];

  queue.push(startNode);
  visited.add(startNode);

  const delayBetweenNodes = 500; // Adjust delay time between nodes (in milliseconds)

  const traverseQueueWithDelay = () => {
    if (queue.length > 0) {
      setTimeout(() => {
        const currentNode = queue.shift();
        bfsPath.push(currentNode);
        setVisitedNodes(new Set(bfsPath)); // Update visited nodes

        Object.keys(adjacencyList[currentNode]).forEach((neighbor) => {
          const neighborId = parseInt(neighbor);
          if (!visited.has(neighborId)) {
            visited.add(neighborId);
            queue.push(neighborId);

            // Add edge to visitedEdges set (both directions for bidirectional)
            const edgeKey = `${currentNode}-${neighborId}`;
            const reverseEdgeKey = `${neighborId}-${currentNode}`;
            setVisitedEdges((prevVisitedEdges) => {
              const newVisitedEdges = new Set(prevVisitedEdges);
              newVisitedEdges.add(edgeKey);
              newVisitedEdges.add(reverseEdgeKey);
              return newVisitedEdges;
            });
          }
        });

        traverseQueueWithDelay(); // Continue traversing
      }, delayBetweenNodes);
    }
  };

  traverseQueueWithDelay(); // Start BFS traversal with delay
};


  const handleRunClick = () => {
    setVisitedNodes(new Set());
    setVisitedEdges(new Set());
    runBFS(1);
  };

console.log("vis",visitedNode)
console.log("edges",visitedEdges)

    return (
      <div className="visualizer-container">
        <h2>Breadth-First Search Visualizer</h2>
        <div className="controls">
          <label htmlFor="nodeSlider">Number of nodes: {nodes.length}</label>
          <input
            id="nodeSlider"
            type="range"
            min="1"
            max="30"
            value={nodes.length}
            onChange={(e) => initializeGraph(Number(e.target.value))}
          />
          <button onClick={handleRunClick}>Run BFS</button>
        </div>
        <div className="graph">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`node ${visitedNode.has(node.id) ? 'visited' : ''} ${selectedNode === node.id ? 'selected' : ''}`}
              style={{ top: node.y, left: node.x }}
            >
              {node.id}
            </div>
          ))}
<svg className="edges">
  {Object.entries(adjacencyList).flatMap(([from, neighbors]) =>
    Object.entries(neighbors).map(([to, weight]) => {
      const edgeKey = `${from}-${to}`;
      const reverseEdgeKey = `${to}-${from}`; // For bidirectional edges
      const isVisitedEdge = visitedEdges.has(edgeKey) || visitedEdges.has(reverseEdgeKey);

      const fromNode = nodes.find((node) => node.id === parseInt(from));
      const toNode = nodes.find((node) => node.id === parseInt(to));
      if (fromNode && toNode) {
        const startX = fromNode.x + 15;
        const startY = fromNode.y + 15;
        const endX = toNode.x + 15;
        const endY = toNode.y + 15;
        return (
          <line
            key={`${from}-${to}`}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            className={`edge ${isVisitedEdge ? 'highlighted-edge' : ''}`}
          />
        );
      }
      return null;
    })
  )}
</svg>
</div>
<div className="sidebar">
          <h3>Visited Nodes</h3>
          <ul>
            {[...visitedNode].map((node) => (
              <li key={node}>Node {node}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

export default BFSAlgorithm;
