import { handleSignOut } from "../auth/serverActions";

export const useAuth = () => {
    return {
        handleSignOut,
    };
};
