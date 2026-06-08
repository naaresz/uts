import { useForm } from "react-hook-form";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../components/Input";
import InputPassword from "../components/InputPassword";
import Button  from "../components/Button";

type FormData = {
    username: string;
    password: string;
    password_confirm: string;
    foto: string;
}

const schema = z.object({
    username: z.string().min(8, "Username minimal 8 karakter!"),
    password: z.string().min(8, "Minimal 8 Karakter"),
    password_confirm: z.string().min(8, "Minimal 8 Karakter"),
    foto: z.string().url("Foto tidak boleh kosong!"),
}).refine((data) => data.password === data.password_confirm, {
    message: "Password tidak sama",
    path: ["password_confirm"],
});



export default function Register(){

    const {register, handleSubmit, formState:{errors} } = useForm<FormData>({ resolver: zodResolver(schema) });
    
    const onSubmit = async (data:FormData) => {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                setRedirect(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const [redirect, setRedirect] = useState(false);

    if (redirect) {
        return <Navigate to="/login" />
    }

    return(
        <div className="min-h-screen flex items-center justify-center py-10">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
            <h2 className="text-3xl font-bold text-center mb-1 text-[#76153C]">
                    Selamat Datang!
                </h2>
                <p className="text-center mb-3 text-gray-500">
                    Registrasi untuk melanjutkan
                </p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <Input 
                    label="Username" 
                    name="username" 
                    register={register} 
                    error={errors.username?.message}
                    placeholder="Username Anda"
                />

                <Input 
                    label="Foto" 
                    name="foto" 
                    register={register} 
                    error={errors.foto?.message}
                    placeholder="url foto"
                />

                <InputPassword
                    label="Password" 
                    name="password" 
                    register={register} 
                    error={errors.password?.message}
                    placeholder="......."
                />

                <InputPassword
                    label="Konformasi Password" 
                    name="password_confirm" 
                    register={register} 
                    error={errors.password_confirm?.message}
                    placeholder="........"
                />
                
                <Button title="Register" variant="primary" className="hover:bg-[#3A0519]" />

            </form>
        </div>
        </div>
    );
}