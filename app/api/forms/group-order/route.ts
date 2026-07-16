import { handleFormRequest } from "@/lib/forms/handler";

export async function POST(request: Request): Promise<Response> {
  return handleFormRequest(request, "group-order");
}
