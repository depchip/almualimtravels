"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { PostEditor } from "@/components/admin/post-editor";
import { getPost } from "@/lib/blog/posts";
import type { BlogPost } from "@/lib/blog/types";

// Static export can't pre-build a page per post, so the post id comes from ?id= instead of the path.
export default function EditPostPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <EditPostLoader />
    </Suspense>
  );
}

function EditPostLoader() {
  const id = useSearchParams().get("id");
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setPost(null);
      return;
    }

    setPost(undefined);
    getPost(id)
      .then(setPost)
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return <Message text="Could not load this post. Check your connection and try again." />;
  }

  if (post === undefined) {
    return <Spinner />;
  }

  if (!id || !post) {
    return <Message text="This post doesn't exist. It may have been deleted." />;
  }

  return <PostEditor key={post.id} postId={post.id} initial={post} />;
}

function Spinner() {
  return (
    <div className="flex justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading" />
    </div>
  );
}

function Message({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <p className="text-slate-600">{text}</p>
      <Link href="/admin" className="mt-4 inline-block font-semibold text-primary hover:underline">
        Back to all posts
      </Link>
    </div>
  );
}
