import { inscriptionInterface } from "./inscription.interface.js";


export interface competitionInterface{
    id: number;
    name: string;
    dateStart: Date;
    dateInscriptionLimit: Date;
    game: number;
    region: number;
    userCreator: number;
    registrations?: inscriptionInterface[];
}