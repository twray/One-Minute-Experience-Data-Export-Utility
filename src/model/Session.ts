export class Session {

  constructor(
    public id: number,
    public start_time: Date,
    public end_time: Date
  ) { }

  getDurationInMinutes(): number {
    return Math.ceil(
      Math.abs(this.end_time.getTime() - this.start_time.getTime()) / 1000 / 60
    );
  }

}

export interface SessionAndTotalVisits {
  session: Session,
  totalVisits: number
}
