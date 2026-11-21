"use server";

import { redirect } from "next/navigation";
import { confirm, unsubscribe } from "@/lib/ai-check/monitor";

export async function confirmAction(formData: FormData) {
  const sub = await confirm(String(formData.get("id") ?? ""));
  redirect(sub ? `/ai-tools/monitor?done=confirmed&host=${sub.host}` : "/ai-tools/monitor?done=invalid");
}

export async function unsubscribeAction(formData: FormData) {
  const sub = await unsubscribe(String(formData.get("id") ?? ""));
  redirect(sub ? `/ai-tools/monitor?done=unsubscribed&host=${sub.host}` : "/ai-tools/monitor?done=invalid");
}
