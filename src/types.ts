import { User, Session } from "better-auth";

export type AppBindings = {
  Bindings: Env;
  Variables: {
    user: User | null;
    session: Session | null;
  };
};
