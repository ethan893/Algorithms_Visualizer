import React, { useState } from 'react';
import './DijkstraVisualizer.css';

const DijkstraVisualizer = () => {
  const [nodes, setNodes] = useState([]);
  const [adjacencyList, setAdjacencyList] = useState({});
  const [visitedNode, setVisitedNodes] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [visitedEdges, setVisitedEdges] = useState([]);

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

  const runDijkstra = (graph, source) => {
    const distances = {};
    const previous = {};
    const queue = new Set(Object.keys(graph));
  
    // Initialize distances and previous nodes
    for (let node in graph) {
      distances[node] = Infinity;
      previous[node] = null;
    }
    distances[source] = 0;
  
    while (queue.size > 0) {
      // Find the node with the smallest distance
      let minNode = null;
      queue.forEach((node) => {
        if (minNode === null || distances[node] < distances[minNode]) {
          minNode = node;
        }
      });
  
      // Remove the node from the queue
      queue.delete(minNode);
  
      // Update distances to neighboring nodes
      for (let neighbor in graph[minNode]) {
        const alt = distances[minNode] + graph[minNode][neighbor];
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = minNode;
        }
      }
    }
  
    return { distances, previous };
  };
  
  const getSelectedPath = (previous,clickedNode) => {
    const paths = {};
    
    for (let node in previous) {
      const path = [];
      let current = node;
  
      while (current !== null) {
        path.unshift(current);
        current = previous[current];
      }
  
      paths[node] = path;
    }
  
    for (let node in paths) {
      console.log(`Path to ${node}: ${paths[node].join(' -> ')}`);
    }
    console.log(`Path from 1 to clickedNode (${clickedNode})`,paths[clickedNode])
    return paths[clickedNode];
  };
  
  const { distances, previous } = runDijkstra(adjacencyList, '1');
  
  const handleNodeClick = (nodeId) => {
    setSelectedNode(nodeId);
    runDijkstra(1, adjacencyList);
    let path = getSelectedPath(previous,nodeId)
    highlightShortestPath(path);
    console.log(`Node ${nodeId} clicked`);
  };

  const highlightShortestPath = (path) => {
    // Convert path elements to numbers if needed
    const numericPath = path.map(Number);
    const newVisitedNodes = new Set(numericPath);
    setVisitedNodes(newVisitedNodes);

    const newVisitedEdges = [];
    for (let i = 0; i < path.length - 1; i++) {
      const fromNode = path[i];
      const toNode = path[i + 1];
      newVisitedEdges.push(`${fromNode}-${toNode}`);
    }
    setVisitedEdges(newVisitedEdges);
  };


  console.log("visitedNodes", visitedNode);
  console.log("selectedNode", selectedNode);


  // JSX 
  return (
    <div className="visualizer-container">
      <h2>Dijkstra's Algorithm Visualizer</h2>
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
      </div>
      <div className="graph">
        {nodes.map((node) => (
          <div
          key={node.id}
          className={`node ${visitedNode.has(node.id) ? 'visited' : ''} ${selectedNode === node.id ? 'selected' : ''}`}
          style={{ top: node.y, left: node.x }}
          onClick={() => handleNodeClick(node.id)}
          >
            {node.id}
          </div>
        ))}
<svg className="edges">
  {Object.entries(adjacencyList).flatMap(([from, neighbors]) =>
    Object.entries(neighbors).map(([to, weight]) => {
      const edgeKey = `${from}-${to}`;
      const isVisitedEdge = visitedEdges.includes(edgeKey);

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
          <h3>Adjacency List</h3>
          <h3> Starting point: Connecting Node (weight)</h3>
          <pre>
            {Object.entries(adjacencyList).map(([node, neighbors]) => (
              <div key={node}>
                {`${node}: `}
                {Object.entries(neighbors).map(([neighbor, weight], index) => (
                  <span key={neighbor}>
                    {`${neighbor} (${Math.round(weight)})${index < Object.keys(neighbors).length - 1 ? ', ' : ''}`}
                  </span>
                ))}
              </div>
            ))}
          </pre>
        </div>
    </div>
  );
};

export default DijkstraVisualizer;
