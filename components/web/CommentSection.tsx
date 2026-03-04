"use client";

import { Loader2, MessagesSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { commentSchema } from "@/app/schemas/comment";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

type CommentFormData = z.infer<typeof commentSchema>;

export function CommentSection(props: {
  preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}) {
  const params = useParams<{ postId: Id<"posts"> }>();
  const data = usePreloadedQuery(props.preloadedComments);
  const [ispending, startTransition] = useTransition();

  const createComment = useMutation(api.comments.createComment);
  const form = useForm<CommentFormData>({
    resolver: standardSchemaResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: params.postId,
    },
  });

  function onSubmit(data: CommentFormData) {
    startTransition(async () => {
      try {
        await createComment(data);
        form.reset();
        toast.success("Comment created successfully");
      } catch {
        toast.error("Failed to create comment");
      }
    });
  }

  if (!data) return <p>Loading...</p>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessagesSquare className="size-5" />
        <h2 className="text-xl font-bold">{data.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thoughts.."
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button disabled={ispending}>
            {ispending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              "Comment"
            )}
          </Button>
        </form>
        {data?.length > 0 && <Separator />}
        <section className="space-y-6">
          {data?.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName}
                />
                <AvatarFallback>
                  {comment.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{comment.authorName}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(comment._creationTime).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-sm text-foreground opacity-90 whitespace-pre-wrap leading-relaxed">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
