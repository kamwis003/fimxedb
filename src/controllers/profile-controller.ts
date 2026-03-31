import type { Request, Response } from "express"
import { asyncHandler } from "@/utils/functions/async-handler"
import { listProfiles } from "@/services/profile-service"


export const listProfilesController = asyncHandler(
  async (_req: Request, res: Response) => {
    const profiles = await listProfiles()
    return res.status(200).json({ success: true, data: profiles })
  }
)
