import { useEffect, useState } from "react";
import SpeakerCard from "../../../components/SpeakerCard";
import { Link } from "react-router-dom"

interface Speaker {
  id: number;
  nama: string;
  materi?: string;
  jabatan: string;
  foto: string;
}

export default function PembicaraIndex(){
    const [speakers, setSpeakers] = useState<Speaker[]>([]);

    useEffect(() => {
      fetch(import.meta.env.VITE_API_URL + "/speakers")
        .then((res) => res.json())
        .then((data) => setSpeakers(data))
        .catch((err) => console.log("Gagal ambil data speaker", err))
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm("Yakin ingin menghapus pembicara?");

        if (!confirmDelete) return;

        try {
            await fetch(import.meta.env.VITE_API_URL + `/speakers/${id}`,
                {method: "DELETE"}
            );
            setSpeakers((prev) =>
                prev.filter((c) => c.id !== id
                )
            );
            alert("Pembicara berhasil dihapus");
        } catch (error) {
            console.log(error);
            alert("Gagal menghapus pembicara!")
        }
    };

    return(
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#76153C]">
                        Pembicara Invofest
                    </h1>

                    <p className="text-xl font-semibold text-[#76153C]">
                        Daftar pembicara yang tersedia
                    </p>
                </div>

                <Link
                    to="/dashboard/pembicara/create"
                    className="px-4 py-2 bg-[#76153C] text-white rounded-lg hover:bg-[#5a0f2d] transition"
                >Tambah Pembicara
                </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-8 justify-items-center">
                {speakers.map((item) => (
                  <div key={item.id} className="w-full flex flex-col items-center gap-3">
                    <SpeakerCard 
                        foto={item.foto}
                        nama={item.nama}
                        materi={item.materi || "-"}
                        jabatan={item.jabatan}
                    />
                    <div className="flex gap-3">
                      <Link
                            to={`/dashboard/pembicara/edit/${item.id}`}
                            className="mt-4 inline-block px-4 py-2 bg-[#76153C] text-white rounded hover:bg-red-700 transition"
                        >Edit
                        </Link>
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="mt-3 ml-2 px-4 py-2 bg-red-600 text-white rounded"
                        >Delete
                        </button>
                    </div>
                  </div>
                ))}
            </div>
        </div>
    )
}