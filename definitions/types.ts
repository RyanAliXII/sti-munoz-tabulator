export type Team = {
  id?: string;
  name: string;
};

export type EventType = {
  id?: string;
  name: string;
  date: Date;
};

export type Score = {
  id?: string;
  eventId: string;
  teamId: string;
  rankId: string;
  additionalPoints: number;
};
export type RankType = {
  id?: string;
  classId: string;
  name: string;
  points: number;
};
export interface TeamScore extends Team {
  score: Score;
}
