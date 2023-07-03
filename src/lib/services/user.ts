import { prisma } from "../prisma";

export const getUserBySlug = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      slug: id,
    },
  });

  return user;
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findFirst({
    where: {
      id: id as number,
    },
    include: {
      UserSettings: true,
    },
  });

  return user;
};

export const updateUser = async (u: any) => {
  const user = await prisma.user.update({
    where: {
      id: u.id,
    },
    data: u,
  });

  return user;
};
