import { EventLog, EventLogDB } from '../model/EventLog';

class EventLogService {

  API_ROOT: string = process.env.REACT_APP_SERVER_API_ROOT || '';
  DB_TABLE: string = process.env.REACT_APP_DB_TABLE || '';

  private eventLogDBToEventLog(eventLogDB: EventLogDB): EventLog {

    return {
      id: eventLogDB.id,
      name: eventLogDB.name,
      duration: eventLogDB.duration || undefined,
      session_code: eventLogDB.session_code,
      metadata: eventLogDB.metadata || undefined,
      created_on: new Date(eventLogDB.created_on)
    }

  }

  async getScanEvents(fromDate?: Date, toDate?: Date): Promise<EventLog[]> {

    let dateQueryString = '';
    if (fromDate !== undefined) {
      const fromDateAsString = fromDate.toISOString().split('T')[0];
      const toDateAsString = toDate ? toDate.toISOString().split('T')[0] : fromDateAsString;
      dateQueryString = `&filter[created_on][between]=${fromDateAsString} 00:00:00,${toDateAsString} 23:59:59`;
    }

    const response = await fetch(`${this.API_ROOT}/items/${this.DB_TABLE}?filter[name]=read_story${dateQueryString}`);
    const result = await response.json();

    return result.data?.map((eventLogDB: EventLogDB) => {
      return this.eventLogDBToEventLog(eventLogDB)
    }) || [];

  }

}

export default EventLogService;
