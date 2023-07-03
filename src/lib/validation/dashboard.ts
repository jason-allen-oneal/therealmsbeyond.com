import { object, string, mixed, InferType } from "yup";

let dashboardSchema = object({
  email: string().email(),
  username: string().min(3).max(30),
  password: string(),
  bio: string(),
});

export default dashboardSchema;
export type DashboardInput = {
  email: string;
  username: string;
  password: string;
  bio: string;
  avatar?: File;
};
