export interface matchInterface {
  id: number;
  matchDate: Date;
  round: string;
  winner: number | null;
  draw: boolean;
  teams: number[];
}