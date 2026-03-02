import { Request, Response } from "express";
import {
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "../services/task.service";
import { prisma } from "../db/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { NotFoundError } from "../utils/appError";

type IdParams = { id: string };

export const create = asyncHandler(async (req: Request, res: Response) => {
  const task = await createTask(req.user!.id, req.body);
  res.status(201).json({ success: true, data: task });
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, status, search } = (req as any).validated as {
    page: number;
    limit: number;
    status?: string;
    search?: string;
  };

  const skip = (page - 1) * limit;

  const where = {
    userId: req.user!.id,
    ...(status ? { status: status as any } : {}),
    ...(search
      ? { title: { contains: search, mode: "insensitive" as const } }
      : {}),
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where }),
  ]);

  res.json({
    success: true,
    data: tasks,
    meta: { total, page, limit },
  });
});

export const getOne = asyncHandler(async (req: Request<IdParams>, res: Response) => {
  const task = await getTaskById(req.params.id, req.user!.id);

  if (!task) throw new NotFoundError("Task not found");

  res.json({ success: true, data: task });
});

export const update = asyncHandler(async (req: Request<IdParams>, res: Response) => {
  const task = await getTaskById(req.params.id, req.user!.id);

  if (!task) throw new NotFoundError("Task not found");

  const updated = await updateTask(req.params.id, req.user!.id, req.body);
  res.json({ success: true, data: updated });
});

export const remove = asyncHandler(async (req: Request<IdParams>, res: Response) => {
  const task = await getTaskById(req.params.id, req.user!.id);

  if (!task) throw new NotFoundError("Task not found");

  await deleteTask(req.params.id, req.user!.id);
  res.status(200).json({ success: true, message: "Task deleted" });
});

export const toggle = asyncHandler(async (req: Request<IdParams>, res: Response) => {
  const task = await getTaskById(req.params.id, req.user!.id);

  if (!task) throw new NotFoundError("Task not found");

  const newStatus = task.status === "DONE" ? "TODO" : "DONE";

  const updated = await prisma.task.update({
    where: { id: task.id },
    data: { status: newStatus },
  });

  res.json({ success: true, data: updated });
});