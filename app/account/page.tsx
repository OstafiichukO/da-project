import { auth } from "../auth/auth";
import EditAccountForm from "./EditAccountForm";

export default async function AccountPage() {
    const session = await auth();
    const user = session?.user as {
        id: string;
        email: string;
        name: string;
    } | null;

    if (!user) {
        return (
            <div className="container mx-auto pt-20">
                <h1 className="text-2xl font-bold mb-4">My Account</h1>
                <p>You need to be logged in to view this page.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto pt-20 max-w-xl">
            <h1 className="text-3xl font-bold mb-6">My Account</h1>
            <div className="bg-white rounded-lg shadow p-6 mb-8 text-gray-900">
                <EditAccountForm user={user} />
            </div>
        </div>
    );
}
