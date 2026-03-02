import { Router } from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  toggle,
} from "../controllers/task.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from "../schemas/task.schema";

const router = Router();

router.use(authenticate);

router.get("/", validate(taskQuerySchema, "query"), getAll);
router.post("/", validate(createTaskSchema), create);
router.get("/:id", getOne);
router.patch("/:id", validate(updateTaskSchema), update);
router.delete("/:id", remove);
router.post("/:id/toggle", toggle);

export default router;