import { Bell } from "lucide-react";
import useAuth from "../../hooks/useAuth";

export default function Topbar() {
    const { user } = useAuth();

    return (
        <header className="flex h-20 items-center justify-between border-b bg-white px-8">
            <div>
                <h2 className="text-2xl font-semibold">
                    Welcome back 👋
                </h2>

                <p className="text-gray-500">
                    {user?.displayName}
                </p>
            </div>

            <div className="flex items-center gap-5">
                <Bell />

                <img
                    src={user?.photoURL}
                    alt=""
                    className="h-11 w-11 rounded-full"
                />
            </div>
        </header>
    );
}