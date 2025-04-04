import { User } from "./user.type";
import { SuccessResponse } from "./utils.type";

//CHỨA TYPE LIEN QUAN VC AUTHENTICATE
export type AuthResponse = SuccessResponse<{
    access_token: string;
    expires: string;
    user: User;
}>;
