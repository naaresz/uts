import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import InputPassword from "../../../components/InputPassword";

type FormData = {
    username: string;
    password: string;
    confirmPassword: string;
    foto: string;
};

const schema = z.object({
    username: z.string().min(1, "Username tidak boleh kosong!"),
    password: z.string().min(1, "Password tidak boleh kosong!"),
    confirmPassword: z.string().min(1, "Konfirmasi password tidak boleh kosong!"),
    foto: z.string().min(1, "Foto tidak boleh kosong!"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak sama!",
    path: ["confirmPassword"],
});

export default function UserCreate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + `/users/${id}`)
        .then((res) => res.json())
        .then((data) => {
            reset({
                username: data.username,
                password: data.password,
                foto: data.foto,
            });
        })
        .catch((err) => console.log(err));
    }, [id, reset]);

    const onSubmit = async (data: FormData) => {
        try {
            await fetch(import.meta.env.VITE_API_URL + `/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: data.username,
                    password: data.password,
                    foto: data.foto,
                }),
            });

            navigate("/dashboard/users");
        } catch (error) {
            console.log("Gagal menambahkan user", error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-10">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
                <h2 className="text-3xl font-bold text-center mb-1 text-[#76153C]">
                    Edit User
                </h2>

                <p className="text-center mb-3 text-gray-500">
                    Silahkan Isi Detail User
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    <Input
                        label="Username"
                        name="username"
                        register={register}
                        error={errors.username?.message}
                        placeholder="Contoh: andira123"
                    />

                    <InputPassword
                        label="Password"
                        name="password"
                        register={register}
                        error={errors.password?.message}
                        placeholder="••••••••"
                    />

                    <InputPassword
                        label="Konfirmasi Password"
                        name="confirmPassword"
                        register={register}
                        error={errors.confirmPassword?.message}
                        placeholder="••••••••"
                    />

                    <Input
                        label="Foto"
                        name="foto"
                        register={register}
                        error={errors.foto?.message}
                        placeholder="Contoh: foto-profile.jpg / link / path"
                    />

                    <Button
                        title="Edit User"
                        variant="primary"
                        className="hover:bg-[#3A0519]"
                    />
                </form>
            </div>
        </div>
    );
}