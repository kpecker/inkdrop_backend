export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}
