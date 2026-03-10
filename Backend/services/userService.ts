import prisma from '../lib/prisma';

export const getUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: { id },
    });
};

export const createUser = async (data: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role?: string;
}) => {
    return prisma.user.create({
        data,
    });
};

export const updateUser = async (id: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    dni?: string;
    address?: string;
}) => {
    return prisma.user.update({
        where: { id },
        data,
    });
};
