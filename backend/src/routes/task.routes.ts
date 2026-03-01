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

const router = Router();

router.use(authenticate);

router.get("/", getAll);
router.post("/", create);
router.get("/:id", getOne);
router.patch("/:id", update);
router.delete("/:id", remove);
router.post("/:id/toggle", toggle);

export default router;