import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: { id }
    });
};

export const createUser = async (data: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}) => {
    return await prisma.user.create({
        data
    });
};

export const updateUser = async (id: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    dni?: string;
    address?: string;
}) => {
    return await prisma.user.update({
        where: { id },
        data
    });
};
