import { handleFormRequest } from "@/lib/forms/handler";

export async function POST(request: Request): Promise<Response> {
  return handleFormRequest(request, "marketing-preferences");
}
