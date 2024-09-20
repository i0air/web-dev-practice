export type IdType = string;
export type TimelineNode = { id: IdType; name: string; date: Date };
export type TimelineLink = { source: IdType; target: IdType };
export type TimelineProps = { nodes: TimelineNode[]; links: TimelineLink[]; padding: number[]; width: number; height: number };
