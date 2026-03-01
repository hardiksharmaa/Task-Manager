import { Request, Response } from "express";
import {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/task.service";
import { prisma } from "../db/prisma";

type IdParams = { id: string };

export const create = async (req: Request, res: Response) => {
  try {
    const task = await createTask(req.user!.id, req.body);
    res.status(201).json(task);
  } catch {
    res.status(400).json({ error: "Failed to create task" });
  }
};

export const getAll = async (req: Request, res: Response) => {
  const { page = 1, limit = 10, status, search } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const tasks = await prisma.task.findMany({
    where: {
      userId: req.user!.id,
      ...(status ? { status: status as any } : {}),
      ...(search
        ? {
            title: {
              contains: search as string,
              mode: "insensitive",
            },
          }
        : {}),
    },
    skip,
    take: Number(limit),
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.task.count({
    where: { userId: req.user!.id },
  });

  res.json({
    data: tasks,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
    },
  });
};

export const getOne = async (req: Request<IdParams>, res: Response) => {
  const task = await getTaskById(req.params.id, req.user!.id);

  if (!task) return res.status(404).json({ error: "Not found" });

  res.json(task);
};

export const update = async (req: Request<IdParams>, res: Response) => {
  await updateTask(req.params.id, req.user!.id, req.body);
  res.json({ message: "Updated" });
};

export const remove = async (req: Request<IdParams>, res: Response) => {
  await deleteTask(req.params.id, req.user!.id);
  res.json({ message: "Deleted" });
};

export const toggle = async (req: Request<IdParams>, res: Response) => {
  const task = await getTaskById(req.params.id, req.user!.id);

  if (!task) return res.status(404).json({ error: "Not found" });

  const newStatus =
    task.status === "DONE" ? "TODO" : "DONE";

  const updated = await prisma.task.update({
    where: { id: task.id },
    data: { status: newStatus },
  });

  res.json(updated);
};