"use client";

import { useState } from "react";

import { PostEditor } from "@/components/admin/post-editor";
import { newPostId } from "@/lib/blog/posts";

export default function NewPostPage() {
  const [postId] = useState(newPostId);

  return <PostEditor postId={postId} initial={null} />;
}
