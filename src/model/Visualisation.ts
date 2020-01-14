export interface VisualisationNodesAndEdges {
  nodes: VisualisationNode[],
  edges: VisualisationEdge[]
}

export interface VisualisationNode {
  id: string,
  node_type: 'artwork'|'session',
  label: string,
  number_visits: number
}

export interface VisualisationEdge {
  id: string,
  session_id: string,
  artwork_id: string,
  visit_duration: number,
  total_number_visits_in_session: number,
}

export interface CSVExports {
  nodes: string,
  edges: string
}
