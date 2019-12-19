export class Artwork {

  constructor(
    public id: number,
    public title?: string,
    public artist?: string
  ) {}

  static createFromMetadataString(metadata: string): Artwork|undefined {
    const idAndTextData = metadata.split(':');
    const id = Number(idAndTextData?.shift()?.trim());
    const textData = idAndTextData.join(':');
    const artistAndTitle = textData.split('-');
    const artist = artistAndTitle?.shift()?.trim();
    const title = artistAndTitle.join('-').trim();
    return new Artwork(id, title || undefined, artist || undefined);
  }

  toString() {
    let metadataArr = [];
    this.artist && metadataArr.push(this.artist);
    this.title && metadataArr.push(this.title);
    return metadataArr.join(', ');
  }

}

export interface ArtworkAndTotalVisits {
  artwork: Artwork,
  totalVisits: number
}
