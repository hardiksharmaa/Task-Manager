import { prisma } from "../db/prisma";
import { TaskStatus } from "@prisma/client";

export const createTask = async (
  userId: string,
  data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    dueDate?: Date;
    priority?: number;
  }
) => {
  return prisma.task.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const getTaskById = async (taskId: string, userId: string) => {
  return prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });
};

export const updateTask = async (
  taskId: string,
  userId: string,
  data: any
) => {
  return prisma.task.updateMany({
    where: {
      id: taskId,
      userId,
    },
    data,
  });
};

export const deleteTask = async (taskId: string, userId: string) => {
  return prisma.task.deleteMany({
    where: {
      id: taskId,
      userId,
    },
  });
};