export interface userInterface {
  id: number;
  name: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  iconUrl?: string;
  teams?: number[];
  createdAt?: Date;
  updatedAt?: Date;
}
