import { User } from "./user.type";
import { ResponseApi } from "./utils.type";

//CHỨA TYPE LIEN QUAN VC AUTHENTICATE
export type AuthResponse = ResponseApi<{
    access_token: string;
    expires: string;
    user: User;
}>;
