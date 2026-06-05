import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface User {
    id: number;
    username: string;
    foto?: string;
    createdAt: string;
}

export default function UserIndex() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + "/users")
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((error) => console.log("Gagal mengambil data user", error));
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Yakin ingin menghapus user?");

        if (!confirmDelete) return;

        try {
            await fetch(
                import.meta.env.VITE_API_URL + `/users/${id}`,
                { method: "DELETE" }
            );

            setUsers((prev) =>
                prev.filter((u) => u.id !== id)
            );

            alert("User berhasil dihapus");
        } catch (error) {
            console.log(error);
            alert("Gagal menghapus user!");
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#76153C]">
                        User
                    </h1>

                    <p className="text-xl font-semibold text-[#76153C]">
                        Daftar user yang terdaftar
                    </p>
                </div>

                <Link
                    to="/dashboard/users/create"
                    className="px-4 py-2 bg-[#76153C] text-white rounded-lg hover:bg-[#5a0f2d] transition"
                >
                    Tambah User
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-white rounded-xl p-6 shadow-sm border-r-8 border-[#76153C]"
                    >
                        <h3 className="text-2xl font-bold text-[#76153C] mb-2">
                            {user.username}
                        </h3>

                        <p className="text-gray-600 mb-4">
                            Dibuat: {new Date(user.createdAt).toLocaleDateString()}
                        </p>

                        <div className="flex gap-3">
                            <Link
                                to={`/dashboard/users/edit/${user.id}`}
                                className="px-4 py-2 bg-[#76153C] text-white rounded hover:bg-red-700 transition"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={() => handleDelete(user.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}