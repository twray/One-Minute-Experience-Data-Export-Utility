import { EventLog } from '../model/EventLog';
import { Artwork, ArtworkAndTotalVisits} from '../model/Artwork';
import { Session, SessionAndTotalVisits } from '../model/Session';
import {
  VisualisationNodesAndEdges,
  VisualisationNode,
  VisualisationEdge,
  CSVExports
} from '../model/Visualisation';

import EventLogService from './EventLogService';

class CSVExportService {

  eventLogService = new EventLogService();
  artworksAndTotalVisits = new Map<number, ArtworkAndTotalVisits>();
  sessionsAndTotalVisits = new Map<number, SessionAndTotalVisits>();

  constructor(
    private fromDate?: Date,
    private toDate?: Date,
    private excludeArtwork?: Artwork
  ) { }

  async getNodesAndEdges(): Promise<VisualisationNodesAndEdges> {
    const events = await this.eventLogService.getScanEvents(this.fromDate, this.toDate);

    events.forEach((event: EventLog) => {
      if (event.metadata !== undefined) {

        const artwork = Artwork.createFromMetadataString(event.metadata);

        if (artwork !== undefined && artwork.id !== this.excludeArtwork?.id) {
          if (this.artworksAndTotalVisits.has(artwork.id)) {
            const artworkAndTotalVisits = this.artworksAndTotalVisits.get(artwork.id);
            artworkAndTotalVisits && artworkAndTotalVisits.totalVisits++;
          } else {
            this.artworksAndTotalVisits.set(artwork.id, { artwork, totalVisits: 1 });
          }

          const event_end_time = new Date((event.created_on.getTime()) + ((event.duration || 0) * 1000));

          const session = new Session(
            event.session_code,
            event.created_on,
            event_end_time
          );
          if (this.sessionsAndTotalVisits.has(session.id)) {
            const sessionAndTotalVisits = this.sessionsAndTotalVisits.get(session.id);
            if(sessionAndTotalVisits !== undefined) {
              if (event_end_time.getTime() > sessionAndTotalVisits.session.end_time.getTime()) {
                sessionAndTotalVisits.session.end_time = event_end_time;
              }
              sessionAndTotalVisits.totalVisits++;
            }
          } else {
            this.sessionsAndTotalVisits.set(session.id, { session, totalVisits: 1 })
          }

        }

      }
    });

    let nodes: VisualisationNode[] = [];
    let edges: VisualisationEdge[] = [];

    Array.from(this.artworksAndTotalVisits.values()).forEach((artworkAndTotalVisits: ArtworkAndTotalVisits) => {
      nodes.push({
        id: `a_${artworkAndTotalVisits.artwork.id}`,
        node_type: 'artwork',
        label: artworkAndTotalVisits.artwork.toString(),
        number_visits: artworkAndTotalVisits.totalVisits
      });
    });

    Array.from(this.sessionsAndTotalVisits.values()).forEach((sessionAndTotalVisits: SessionAndTotalVisits) => {
      nodes.push({
        id: `s_${sessionAndTotalVisits.session.id}`,
        node_type: 'session',
        label: `${sessionAndTotalVisits.session.getDurationInMinutes()} min${sessionAndTotalVisits.session.getDurationInMinutes() !== 1 ? 's' : ''}`,
        number_visits: sessionAndTotalVisits.totalVisits
      });
    });

    events.forEach((event: EventLog, counter: number) => {
      if (event.metadata !== undefined) {

        const artwork = Artwork.createFromMetadataString(event.metadata);

        if (artwork !== undefined && artwork.id !== this.excludeArtwork?.id) {

          const sessionAndTotalVisits = this.sessionsAndTotalVisits.get(event.session_code);

          if (sessionAndTotalVisits !== undefined) {

            edges.push({
              id: `v_${(counter + 1).toString()}`,
              session_id: `s_${sessionAndTotalVisits.session.id}`,
              artwork_id: `a_${artwork.id}`,
              visit_duration: event.duration || 0,
              total_number_visits_in_session: sessionAndTotalVisits.totalVisits
            });

          }

        }

      }
    });

    return { nodes, edges };

  }

  async getCSVExports(): Promise<CSVExports> {

    let nodes: string = "id,node_type,label,number_visits\r\n";
    let edges: string = "id,session_id,artwork_id,visit_duration,total_number_visits_in_session\r\n";

    const nodesAndEdges = await this.getNodesAndEdges();

    nodesAndEdges.nodes.forEach((node: VisualisationNode) => {
      nodes += `"${node.id}","${node.node_type}","${node.label}",${node.number_visits}\r\n`;
    });

    nodesAndEdges.edges.forEach((edge: VisualisationEdge) => {
      edges += `"${edge.id}","${edge.session_id}","${edge.artwork_id}",${edge.visit_duration},${edge.total_number_visits_in_session}\r\n`;
    });

    return { nodes, edges };

  }

}

export default CSVExportService;
