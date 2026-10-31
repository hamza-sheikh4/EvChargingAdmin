import { z } from "zod";
import { teamCopy } from "@/content/team";

const errors = teamCopy.errors;

/** Same rules as the backend's AdminRequest.addMember. */
export const addMemberSchema = z.object({
  fullName: z.string().trim().min(2, errors.name).max(80, errors.name),
  email: z.string().trim().toLowerCase().email(errors.email).max(160, errors.email),
  permissions: z.array(z.string()).min(1, errors.permissions),
});

export type AddMemberErrors = Partial<Record<"fullName" | "email" | "permissions", string>>;

/** The first message per field, ready for the form. */
export function addMemberErrors(error: z.ZodError): AddMemberErrors {
  const result: AddMemberErrors = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof AddMemberErrors;
    result[field] ??= issue.message;
  }
  return result;
}
