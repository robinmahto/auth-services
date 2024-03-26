import { Request } from "express";

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UserType {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}

export interface RegisterDataRequest extends Request {
    body: UserData;
}
