export type PacketDetails = {
  title: string;
  summary: string;
  offset: number;
  length: number;
  fields: DetailField[]
}

export type DetailField = {
  label: string;
  value: string;
  offset: number;
  length: number;
  children?: DetailField[]
}

export type DetailsBuilderResult = {
  details: PacketDetails;
  headerLength: number;
}