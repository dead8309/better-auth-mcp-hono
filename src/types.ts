import { Environment } from "@/env";
import { User, Session } from "better-auth";

export type AppBindings = {
  Bindings: Environment;
  Variables: {
    user: User | null;
    session: Session | null;
  };
};
