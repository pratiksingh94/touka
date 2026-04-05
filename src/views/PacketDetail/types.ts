export type PacketDetails = {
  title: string;
  summary: string;
  offset: number;
  length: number;
  fields: PacketField[]
}

export type PacketField = {
  label: string;
  value: string;
  offset: number;
  length: number;
  children?: PacketField[]
}

export type SelectedField = {
  offset: number;
  length: number;
} | null;

export type DetailsBuilderResult = {
  details: PacketDetails;
  headerLength: number;
}