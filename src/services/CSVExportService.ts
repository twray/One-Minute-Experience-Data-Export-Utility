import { EventLog } from '../model/EventLog';
import { Artwork, ArtworkAndTotalVisits} from '../model/Artwork';
import { Session, SessionAndTotalVisits } from '../model/Session';

import EventLogService from './EventLogService';

class CSVExportService {

  eventLogService = new EventLogService();
  artworksAndTotalVisits = new Map<number, ArtworkAndTotalVisits>();
  sessionsAndTotalVisits = new Map<number, SessionAndTotalVisits>();


  constructor(
    private fromDate?: Date,
    private toDate?: Date
  ) { }

  async getNodes() {
    const events = await this.eventLogService.getScanEvents(this.fromDate, this.toDate);

    events.forEach((event: EventLog) => {
      if (event.metadata !== undefined) {

        const artwork = Artwork.createFromMetadataString(event.metadata);
        if (artwork !== undefined) {
          if (this.artworksAndTotalVisits.has(artwork.id)) {
            const artworkAndTotalVisits = this.artworksAndTotalVisits.get(artwork.id);
            artworkAndTotalVisits && artworkAndTotalVisits.totalVisits++;
          } else {
            this.artworksAndTotalVisits.set(artwork.id, { artwork, totalVisits: 1 });
          }
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
    });

    Array.from(this.artworksAndTotalVisits.values()).forEach((artworksAndTotalVisits: ArtworkAndTotalVisits) => {
      console.log(artworksAndTotalVisits);
    });

    Array.from(this.sessionsAndTotalVisits.values()).forEach((sessionAndTotalVisits: SessionAndTotalVisits) => {
      console.log(sessionAndTotalVisits);
      console.log(sessionAndTotalVisits.session.getDurationInMinutes());
    });

  }

}

export default CSVExportService;
