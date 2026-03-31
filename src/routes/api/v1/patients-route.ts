import { Router } from "express"
import { listProfilesController } from "@/controllers/profile-controller"

const router = Router()
router.get("/", listProfilesController)
export default router
