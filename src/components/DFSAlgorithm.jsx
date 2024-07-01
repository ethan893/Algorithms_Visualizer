import React, { useState} from 'react';
import './DFSVisualizer.css';

const DFSAlgorithm = () => {
  const [selectedNode, setSelectedNode] = useState(null);
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




const runDFS = (startNode) => {
  const visited = new Set();
  const dfsPath = [];

  const dfs = (node, delay) => {
    if (!visited.has(node)) {
      visited.add(node);
      dfsPath.push(node);
      setVisitedNodes(new Set(dfsPath));

      const neighbors = Object.entries(adjacencyList[node]);

      neighbors.forEach(([neighbor, weight]) => {
        const neighborId = parseInt(neighbor);
        if (!visited.has(neighborId)) {
          // Check if the edge exists in adjacencyList
          if (adjacencyList[node][neighborId] !== undefined) {
            setTimeout(() => {
              dfs(neighborId, delay + 500); // Increment delay for each neighbor
            }, delay + 1000); // Increment delay for each neighbor

            // Update visited edges (ensure bidirectional edges are considered)
            const newEdge1 = `${node}-${neighborId}`;
            const newEdge2 = `${neighborId}-${node}`;
            setVisitedEdges((prevVisitedEdges) => {
              const newVisitedEdges = new Set(prevVisitedEdges);
              newVisitedEdges.add(newEdge1);
              newVisitedEdges.add(newEdge2);
              return newVisitedEdges;
            });
          }
        }
      });
    }
  };

  dfs(startNode, 0); // Start DFS with initial delay of 0
};


  const handleRunClick = () => {
    setVisitedNodes(new Set());
    setVisitedEdges(new Set());
    runDFS(1); // Start DFS from node 1
  };
console.log("vis",visitedNode)
console.log("edges",visitedEdges)
    return (
      <div className="visualizer-container">
        <h2>Depth-First Search Visualizer</h2>
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
          <button onClick={handleRunClick}>Run DFS</button>
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

export default DFSAlgorithm;
