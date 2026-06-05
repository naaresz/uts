import { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import bcrypt from "bcrypt";


export const createUser = async (req: Request, res: Response) => {
    try{
        const { username, password, foto } = req.body;

        if (!username ||
            !password ||
            !foto
        ) {
            return res.status(400).json({message: "Semua data harus diisi!"})
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Username sudah digunakan",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                foto,
            },
        });

        const { password: _, ...userWithoutPassword } = newUser

        return res.status(201).json({
            message: "User berhasil dibuat",
            data: userWithoutPassword,
        });
    } catch (error) {
        console.error(error);

        return res
            .status(500)
            .json({message: "Terjadi kesalahan saat membuat user", error: error instanceof Error? error.message : "Unknown error"});
    }
};