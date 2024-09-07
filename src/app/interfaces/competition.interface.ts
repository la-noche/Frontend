import { SafeResourceUrl } from "@angular/platform-browser";

export interface competitionInterface{
    id: number;
    name: string;
    type: boolean;
    dateStart: Date;
    dateEnding: Date;
    game: number;
    region: number;

}