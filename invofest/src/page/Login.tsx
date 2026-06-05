import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../components/Input";
import InputPassword from "../components/InputPassword";
import Button  from "../components/Button";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

type FormData = {
    username:string;
    password:string;
}

const schema = z.object({
    username: z.string().min(8, "Username minimal 8 karakter"),
    password: z.string().min(8, "Password minimal 8 Karakter"),
});

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login)

    const {register, handleSubmit, formState:{errors} } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data:FormData) => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            localStorage.setItem("token", result.data.token);

            login(result.data.user.username);

            alert(result.message);

            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan pada server ")
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
                <h2 className="text-3xl font-bold text-center mb-1 text-[#76153C]">
                    Selamat Datang!
                </h2>
                <p className="text-center mb-3 text-gray-500">
                    Silahkan login untuk melanjutkan
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input 
                        label="Username" 
                        name="username" 
                        register={register} 
                        error={errors.username?.message}
                        placeholder="Masukkan Username anda"
                    />

                    <InputPassword 
                        label="Password" 
                        name="password" 
                        register={register} 
                        error={errors.password?.message}
                        placeholder="........"
                    />

                    <div>
                        <Button title="Login" variant="primary" className="hover:bg-[#3A0519]" ></Button>
                    </div>

                    <div>
                        Belum punya akun ? <Link to="/register" className="text-[#76153C]">Daftar Sekarang</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}