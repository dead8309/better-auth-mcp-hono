import { db } from "@/db";
import { users } from "@/db/schema";
import { AppBindings } from "@/types";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

const router = new Hono<AppBindings>();

// NOTE: Dummy routes to show how normal api endpoints along with mcp

router.get("/:id", async (c) => {
  const { id } = c.req.param();
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return c.json(user);
});

// OR just get details from middleware
router.get("/@me", async (c) => {
  if (!c.var.user) {
    return c.text("NOT AUTHENTICATED");
  }

  return c.json(c.var.user);
});

export default router;
