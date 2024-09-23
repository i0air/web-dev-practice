export type IdType = number;
export type TimelineNode = { id: IdType; line: IdType; name: string; date: string };
export type TimelineLink = { source: IdType; target: IdType };
export type TimelineLine = { id: IdType; name: string };
export type TimelineProps = { nodes: TimelineNode[]; links: TimelineLink[]; lines: TimelineLine[]; padding: number[]; width: number; height: number };
