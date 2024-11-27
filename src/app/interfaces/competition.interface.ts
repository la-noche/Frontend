import { inscriptionInterface } from "./inscription.interface.js";
import { RegionInterface } from "./region.interface.js";


export interface competitionInterface{
    id: number;
    name: string;
    dateStart?: Date;
    dateEnd?: Date;
    winner?: number;
    dateInscriptionLimit: Date;
    game: number;
    region: number;
    userCreator: number;
    registrations?: inscriptionInterface[];
}