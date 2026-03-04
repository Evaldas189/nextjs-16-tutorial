"use server";

import z from "zod";
import { postSchema } from "./schemas/blog";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";
import { updateTag } from "next/cache";

export async function createBlogAction(data: z.infer<typeof postSchema>) {
  const parsed = postSchema.safeParse(data);
  if (!parsed.success) throw new Error("someting went wrong");

  const token = await getToken();

  try {
    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      {
        token,
      },
    );

    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok)
      return {
        error: "Failed to upload image",
      };

    const { storageId } = await uploadResult.json();

    await fetchMutation(
      api.posts.createPost,
      {
        body: parsed.data.content,
        title: parsed.data.title,
        imageStorageId: storageId,
      },
      {
        token,
      },
    );
  } catch {
    return {
      error: "Failed to create post",
    };
  }

  updateTag("blog");
  redirect("/blog");
}
