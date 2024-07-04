import React, { useEffect } from 'react';

export default function Sidebar({ nodes, edges }) {
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };



    function findChildren(nodeId, nodes, edges, visitedNodes = new Set()) {
        const currentNode = nodes.find(node => node.id === nodeId);

        if (!currentNode || visitedNodes.has(nodeId)) {
            return {};  // Return an empty object if currentNode is not found or node has been visited
        }

        visitedNodes.add(nodeId);

        const nodeObject = {
            // id: nodeId,  // Include id in nodeObject
            data: currentNode.data.label,
            // type: currentNode.type,
            children: []  // Initialize children as an empty array
        };

        const childEdges = edges.filter(edge => edge.source === nodeId);
        const childNodeIds = childEdges.map(edge => edge.target);

        for (const childId of childNodeIds) {
            const child = findChildren(childId, nodes, edges, visitedNodes);
            if (child !== null) {  // Check if child is not null
                nodeObject.children.push(child);
            }
        }

        return nodeObject;  // Return nodeObject directly
    }


    function update() {
        const filtered_nodes = nodes.filter(node => node.type === "circle")
        let data = [];
        filtered_nodes.forEach((circleNode) => {
            const dict = findChildren(circleNode.id, nodes, edges)

            data.push(dict)
        })

        const socket = new WebSocket("ws://localhost:3001")
        socket.onopen = function () {
            console.log("Connected")
            socket.send(`/saveFlow/${JSON.stringify({data, nodes, edges})}`)
        }
        
    }

    return (
        <aside>
            <div>You can drag these nodes to the pane on the right.</div>
            <div onDragStart={(event) => onDragStart(event, 'circle')} draggable>
                Circle Node
            </div>
            <div onDragStart={(event) => onDragStart(event, 'rectangle')} draggable>
                Rectangle Node
            </div>
            <div onDragStart={(event) => onDragStart(event, 'triangle')} draggable>
                Triangle Node
            </div>
            <button onClick={update}>Update</button>
        </aside>
    );
};
