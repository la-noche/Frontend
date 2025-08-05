export interface matchInterface {
  id: number;
  matchDate: Date;
  round: string;
  winner: number | null;
  teams: number[];
}