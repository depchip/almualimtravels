"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Timestamp, serverTimestamp } from "firebase/firestore";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  CloudOff,
  Eye,
  EyeOff,
  History,
  Loader2,
  Save,
  Send,
  Trash2,
  X,
} from "lucide-react";

import { ConfirmDelete } from "@/components/admin/confirm-delete";
import { CoverUploader } from "@/components/admin/cover-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { StatusBadge, effectiveStatus, formatPostDate } from "@/components/admin/status-badge";
import { PostView } from "@/components/blog/post-view";
import { canTriggerRebuild, triggerRebuild } from "@/lib/blog/deploy-hook";
import { deletePost, getPost, isSlugTaken, readingMinutes, savePost, slugify, type PostInput } from "@/lib/blog/posts";
import { BLOG_CATEGORIES, DEFAULT_AUTHOR, type BlogPost, type CoverImage, type PostStatus } from "@/lib/blog/types";
import { collectYouTubeIds } from "@/lib/blog/youtube";
import { cn } from "@/lib/utils";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// /blog/post is the live fallback page and /blog/no-posts-yet is the empty-blog placeholder.
const RESERVED_SLUGS = ["post", "no-posts-yet"];
const AUTOSAVE_DELAY_MS = 3000;

const metaSchema = z.object({
  title: z.string().trim().min(1, "Add a title").max(120, "Keep the title under 120 characters"),
  slug: z.string().trim().regex(SLUG_PATTERN, "Use lowercase letters, numbers and single hyphens"),
  excerpt: z.string().trim().max(300, "Keep the excerpt under 300 characters"),
  category: z.enum(BLOG_CATEGORIES),
  tags: z.string(),
  authorName: z.string().trim().max(60),
  featured: z.boolean(),
  metaTitle: z.string().trim().max(70, "Keep the SEO title under 70 characters"),
  metaDescription: z.string().trim().max(160, "Keep the SEO description under 160 characters"),
});

type MetaValues = z.infer<typeof metaSchema>;

type SaveAction = "autosave" | "save" | "publish" | "schedule" | "unpublish";

type Content = { json: Record<string, unknown> | null; html: string };

// Unsaved work kept in the browser in case the tab closes or the connection drops.
type LocalBackup = { savedAt: number; values: MetaValues; cover: CoverImage | null; content: Content };

const backupKey = (postId: string) => `blog-post-backup:${postId}`;

function readBackup(postId: string): LocalBackup | null {
  try {
    const raw = window.localStorage.getItem(backupKey(postId));
    return raw ? (JSON.parse(raw) as LocalBackup) : null;
  } catch {
    return null;
  }
}

function writeBackup(postId: string, backup: LocalBackup | null) {
  try {
    if (backup) window.localStorage.setItem(backupKey(postId), JSON.stringify(backup));
    else window.localStorage.removeItem(backupKey(postId));
  } catch {
    // Storage full or blocked: the backup is a convenience, so ignore.
  }
}

function defaultScheduleValue() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  date.setHours(10, 0, 0, 0);
  return toLocalInput(date);
}

function toLocalInput(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

type PostEditorProps = {
  postId: string;
  initial: BlogPost | null;
};

export function PostEditor({ postId, initial }: PostEditorProps) {
  const router = useRouter();

  const [exists, setExists] = useState(!!initial);
  const [status, setStatus] = useState<PostStatus>(initial?.status ?? "draft");
  const [publishedAt, setPublishedAt] = useState<BlogPost["publishedAt"]>(initial?.publishedAt ?? null);
  const [cover, setCover] = useState<CoverImage | null>(initial?.coverImage ?? null);
  const [content, setContent] = useState<Content>({ json: initial?.contentJson ?? null, html: initial?.contentHtml ?? "" });
  const [editorKey, setEditorKey] = useState(0);
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [saving, setSaving] = useState<SaveAction | null>(null);
  const [problems, setProblems] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(initial?.updatedAt?.toDate() ?? null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleAt, setScheduleAt] = useState(() =>
    initial?.status === "scheduled" && initial.publishedAt ? toLocalInput(initial.publishedAt.toDate()) : defaultScheduleValue(),
  );
  const [backup, setBackup] = useState<LocalBackup | null>(null);

  // Every edit bumps `version`; a save records the version it wrote. Different numbers = unsaved changes.
  const [version, setVersion] = useState(0);
  const [savedVersion, setSavedVersion] = useState(0);
  const dirty = version !== savedVersion;
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const {
    register,
    setValue,
    getValues,
    watch,
    trigger,
    reset,
    setError,
    formState: { errors },
  } = useForm<MetaValues>({
    resolver: zodResolver(metaSchema),
    defaultValues: {
      title: initial?.title ?? "",
      slug: initial?.slug ?? "",
      excerpt: initial?.excerpt ?? "",
      category: initial?.category ?? "Umrah",
      tags: initial?.tags.join(", ") ?? "",
      authorName: initial?.authorName ?? DEFAULT_AUTHOR,
      featured: initial?.featured ?? false,
      metaTitle: initial?.seo.metaTitle ?? "",
      metaDescription: initial?.seo.metaDescription ?? "",
    },
  });

  useEffect(() => {
    const subscription = watch((_values, { type }) => {
      if (type === "change") bump();
    });
    return () => subscription.unsubscribe();
  }, [watch, bump]);

  // Offer to restore a browser backup that is newer than the saved post.
  useEffect(() => {
    const found = readBackup(postId);
    const savedMillis = initial?.updatedAt?.toMillis() ?? 0;
    if (found && found.savedAt > savedMillis + 1000) setBackup(found);
    else if (found) writeBackup(postId, null);
  }, [postId, initial]);

  // Keep the browser backup current while there are unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => writeBackup(postId, { savedAt: Date.now(), values: getValues(), cover, content }), 800);
    return () => clearTimeout(timer);
  }, [dirty, version, postId, cover, content, getValues]);

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const titleField = register("title");
  const excerpt = watch("excerpt");
  const metaDescription = watch("metaDescription");
  const shownStatus = effectiveStatus(status, publishedAt);
  const isLive = shownStatus === "published";
  const isScheduled = shownStatus === "scheduled";

  const save = async (action: SaveAction, scheduleDate?: Date) => {
    const autosave = action === "autosave";
    const values = getValues();
    const parsed = metaSchema.safeParse(values);

    if (!parsed.success) {
      if (!autosave) await trigger();
      return;
    }
    const meta = parsed.data;

    if (!autosave) {
      setProblems([]);
      setNotice(null);
    }

    const contentText = content.html.replace(/<[^>]+>/g, "").trim();
    if (action === "publish" || action === "schedule") {
      const missing = [
        !meta.excerpt && "an excerpt",
        !cover && "a cover photo",
        cover && !cover.alt.trim() && "cover alt text",
        !contentText && "some content",
      ].filter(Boolean) as string[];

      if (missing.length) {
        setProblems([`Before ${action === "schedule" ? "scheduling" : "publishing"}, add ${missing.join(", ")}.`]);
        return;
      }
    }

    if (RESERVED_SLUGS.includes(meta.slug)) {
      if (!autosave) setError("slug", { message: "This URL is reserved by the site. Choose another slug." });
      return;
    }

    const versionAtSave = version;
    setSaving(action);

    try {
      if (await isSlugTaken(meta.slug, postId)) {
        setError("slug", { message: "Another post already uses this URL. Change the slug." });
        return;
      }

      const next = nextPublishState(action, status, publishedAt, scheduleDate);

      const input: PostInput = {
        title: meta.title,
        slug: meta.slug,
        excerpt: meta.excerpt,
        contentJson: content.json,
        contentHtml: content.html,
        coverImage: cover,
        youtubeIds: collectYouTubeIds(content.json),
        category: meta.category,
        tags: meta.tags
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
        status: next.status,
        publishedAt: next.publishedAt,
        authorName: meta.authorName || DEFAULT_AUTHOR,
        readingMinutes: readingMinutes(content.html),
        featured: meta.featured,
        seo: { metaTitle: meta.metaTitle, metaDescription: meta.metaDescription },
      };

      await savePost(postId, input, !exists);

      if (!exists) {
        setExists(true);
        // Swap the URL to the edit page without remounting, so typing isn't interrupted.
        window.history.replaceState(null, "", `/admin/posts/edit?id=${postId}`);
      }

      setStatus(next.status);
      if (next.publishedAt instanceof Timestamp || next.publishedAt === null) {
        setPublishedAt(next.publishedAt);
      } else {
        // Read back the server-set publish time.
        const saved = await getPost(postId);
        setPublishedAt(saved?.publishedAt ?? null);
      }

      setSlugTouched(true);
      setSavedVersion(versionAtSave);
      setLastSavedAt(new Date());
      writeBackup(postId, null);
      setScheduling(false);

      // Publishing, updating a live post or taking one down changes the public pages, so rebuild the static site.
      // Scheduled posts appear on the blog through the live listing when their time comes.
      const wasLive = effectiveStatus(status, publishedAt) === "published";
      const affectsSite = action === "publish" || (action === "unpublish" && wasLive);
      const rebuilding = affectsSite && (await triggerRebuild());

      if (!autosave) {
        setNotice(noticeFor(action, status, next.publishedAt, rebuilding));
      }
    } catch {
      setProblems([
        autosave
          ? "Autosave failed. Your changes are kept in this browser; check your connection."
          : "Saving failed. Check your connection and that you are still signed in.",
      ]);
    } finally {
      setSaving(null);
    }
  };

  // Autosave drafts a few seconds after the last change. Live and scheduled posts only save on demand,
  // so half-finished edits never reach readers.
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    if (!dirty || status !== "draft" || saving) return;
    const timer = setTimeout(() => saveRef.current("autosave"), AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [dirty, version, status, saving]);

  const restoreBackup = () => {
    if (!backup) return;
    reset(backup.values);
    setCover(backup.cover);
    setContent(backup.content);
    setEditorKey((key) => key + 1);
    setSlugTouched(true);
    setBackup(null);
    bump();
  };

  const discardBackup = () => {
    writeBackup(postId, null);
    setBackup(null);
  };

  const handleDelete = async () => {
    await deletePost(postId);
    writeBackup(postId, null);
    if (status !== "draft") await triggerRebuild();
    setSavedVersion(version);
    router.replace("/admin");
  };

  const confirmSchedule = () => {
    const date = new Date(scheduleAt);
    if (Number.isNaN(date.getTime()) || date.getTime() <= Date.now() + 60_000) {
      setProblems(["Pick a date and time in the future to schedule this post."]);
      return;
    }
    save("schedule", date);
  };

  const previewPost = () => {
    const values = getValues();
    const now = new Date().toISOString();
    return {
      id: postId,
      title: values.title || "Untitled post",
      slug: values.slug,
      excerpt: values.excerpt,
      contentHtml: content.html,
      coverImage: cover,
      youtubeIds: collectYouTubeIds(content.json),
      category: values.category,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
      publishedAt: publishedAt?.toDate().toISOString() ?? now,
      updatedAt: now,
      authorName: values.authorName || DEFAULT_AUTHOR,
      readingMinutes: readingMinutes(content.html),
      featured: values.featured,
      seo: { metaTitle: values.metaTitle, metaDescription: values.metaDescription },
    };
  };

  const busy = !!saving && saving !== "autosave";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:text-foreground"
            aria-label="Back to all posts"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-3xl font-semibold">{exists ? "Edit post" : "New post"}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <StatusBadge status={status} publishedAt={publishedAt} />
              {publishedAt && (
                <span>
                  {isScheduled ? "Goes live" : "Published"} {formatPostDate(publishedAt, isScheduled)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SaveIndicator saving={saving} dirty={dirty} lastSavedAt={lastSavedAt} isDraft={status === "draft"} />
          <button
            type="button"
            onClick={() => setPreviewing(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold hover:border-primary hover:text-primary"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
        </div>
      </div>

      {backup && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm">
          <span className="flex items-center gap-2 text-amber-900">
            <History className="h-4 w-4" />
            Unsaved changes from {new Date(backup.savedAt).toLocaleString("en-GB")} were found in this browser.
          </span>
          <span className="flex gap-2">
            <button type="button" onClick={restoreBackup} className="rounded-full bg-amber-600 px-4 py-1.5 font-semibold text-white hover:bg-amber-700">
              Restore
            </button>
            <button type="button" onClick={discardBackup} className="rounded-full px-4 py-1.5 font-semibold text-amber-900 hover:bg-amber-100">
              Discard
            </button>
          </span>
        </div>
      )}

      {problems.length > 0 && (
        <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700">
          {problems.map((problem) => (
            <p key={problem}>{problem}</p>
          ))}
        </div>
      )}

      {notice && (
        <p className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {notice}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr,340px] lg:items-start">
        <div className="min-w-0 space-y-6">
          <CoverUploader
            postId={postId}
            value={cover}
            onChange={(next) => {
              setCover(next);
              bump();
            }}
          />

          <div>
            <textarea
              {...titleField}
              rows={1}
              placeholder="Post title"
              onChange={(event) => {
                titleField.onChange(event);
                if (!slugTouched && status === "draft") {
                  setValue("slug", slugify(event.target.value));
                }
              }}
              className="w-full resize-none bg-transparent [field-sizing:content] font-display text-3xl font-semibold leading-tight placeholder:text-slate-300 focus:outline-none sm:text-5xl"
            />
            {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <RichTextEditor
            key={editorKey}
            postId={postId}
            initialContent={content.json ?? content.html ?? null}
            onChange={(json, html) => {
              setContent({ json, html });
              bump();
            }}
          />
        </div>

        {/* On phones the panels join the page grid so Publish sits at the top, above the editor. */}
        <aside className="contents lg:sticky lg:top-24 lg:block lg:space-y-5">
          <Panel title="Publish" className="order-first lg:order-none">
            <div className="grid gap-2">
              {isLive ? (
                <>
                  <ActionButton onClick={() => save("publish")} busy={saving === "publish"} disabled={busy} variant="primary" icon={Send}>
                    Update post
                  </ActionButton>
                  <ActionButton onClick={() => save("unpublish")} busy={saving === "unpublish"} disabled={busy} icon={EyeOff}>
                    Unpublish
                  </ActionButton>
                </>
              ) : (
                <>
                  <ActionButton onClick={() => save("publish")} busy={saving === "publish"} disabled={busy} variant="primary" icon={Send}>
                    Publish now
                  </ActionButton>
                  <ActionButton onClick={() => setScheduling((open) => !open)} busy={false} disabled={busy} icon={CalendarClock}>
                    {isScheduled ? "Change schedule" : "Schedule…"}
                  </ActionButton>
                  {scheduling && (
                    <div className="space-y-2 rounded-xl bg-slate-50 p-3">
                      <label htmlFor="schedule-at" className="text-xs font-semibold text-slate-600">
                        Go live on (your local time)
                      </label>
                      <input
                        id="schedule-at"
                        type="datetime-local"
                        value={scheduleAt}
                        min={toLocalInput(new Date())}
                        onChange={(event) => setScheduleAt(event.target.value)}
                        className={inputClass}
                      />
                      <ActionButton onClick={confirmSchedule} busy={saving === "schedule"} disabled={busy} variant="primary" icon={CalendarClock}>
                        {isScheduled ? "Update schedule" : "Schedule post"}
                      </ActionButton>
                    </div>
                  )}
                  <ActionButton onClick={() => save("save")} busy={saving === "save"} disabled={busy} icon={Save}>
                    {isScheduled ? "Save changes" : "Save draft"}
                  </ActionButton>
                  {isScheduled && (
                    <ActionButton onClick={() => save("unpublish")} busy={saving === "unpublish"} disabled={busy} icon={X}>
                      Unschedule
                    </ActionButton>
                  )}
                </>
              )}
            </div>
            {!canTriggerRebuild && (
              <p className="flex items-start gap-1.5 text-xs text-slate-500">
                <CloudOff className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                No deploy hook set. Posts show on the blog straight away; their own SEO pages appear after the next site deploy.
              </p>
            )}
            {exists && (
              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:underline"
              >
                <Trash2 className="h-4 w-4" />
                Delete post
              </button>
            )}
          </Panel>

          <Panel title="Details">
            <Field label="URL" error={errors.slug?.message}>
              <div className="flex items-center rounded-xl border border-slate-200 bg-white focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10">
                <span className="pl-3 text-sm text-slate-400">/blog/</span>
                <input
                  {...register("slug", { onChange: () => setSlugTouched(true) })}
                  className="h-11 w-full rounded-xl bg-transparent pr-3 text-sm focus:outline-none"
                />
              </div>
              {isLive && <p className="text-xs text-amber-700">Changing the URL of a live post breaks links already shared.</p>}
            </Field>

            <Field label="Excerpt" hint={`${excerpt.length}/300 · shown on cards and in Google`} error={errors.excerpt?.message}>
              <textarea {...register("excerpt")} rows={3} className={cn(inputClass, "h-auto py-2.5")} />
            </Field>

            <Field label="Category">
              <select {...register("category")} className={inputClass}>
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </Field>

            <Field label="Tags" hint="Separate with commas">
              <input {...register("tags")} placeholder="makkah, packing, first umrah" className={inputClass} />
            </Field>

            <Field label="Author">
              <input {...register("authorName")} className={inputClass} />
            </Field>

            <label className="flex items-center gap-2.5 text-sm font-semibold">
              <input type="checkbox" {...register("featured")} className="h-4 w-4 rounded accent-primary" />
              Feature at the top of the blog
            </label>
          </Panel>

          <Panel title="SEO">
            <Field label="SEO title" hint="Defaults to the post title" error={errors.metaTitle?.message}>
              <input {...register("metaTitle")} className={inputClass} />
            </Field>
            <Field
              label="SEO description"
              hint={`${metaDescription.length}/160 · defaults to the excerpt`}
              error={errors.metaDescription?.message}
            >
              <textarea {...register("metaDescription")} rows={3} className={cn(inputClass, "h-auto py-2.5")} />
            </Field>
            <GooglePreview
              title={watch("metaTitle") || watch("title")}
              slug={watch("slug")}
              description={metaDescription || excerpt}
            />
          </Panel>
        </aside>
      </div>

      {previewing && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-background">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-8">
            <span className="text-sm font-semibold">
              Preview <span className="font-normal text-slate-500">· how readers will see this post</span>
            </span>
            <button
              type="button"
              onClick={() => setPreviewing(false)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-sm font-semibold text-white"
            >
              <X className="h-4 w-4" />
              Close preview
            </button>
          </div>
          <div className="-mt-16">
            <PostView post={previewPost()} />
          </div>
        </div>
      )}

      {confirmingDelete && (
        <ConfirmDelete
          postId={postId}
          title={watch("title")}
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function nextPublishState(
  action: SaveAction,
  status: PostStatus,
  publishedAt: BlogPost["publishedAt"],
  scheduleDate?: Date,
): { status: PostStatus; publishedAt: PostInput["publishedAt"] } {
  const live = effectiveStatus(status, publishedAt) === "published";

  switch (action) {
    case "publish":
      // Keep the original date when updating a live post; otherwise it goes live now (server time).
      return { status: "published", publishedAt: live && publishedAt ? publishedAt : serverTimestamp() };
    case "schedule":
      return { status: "scheduled", publishedAt: Timestamp.fromDate(scheduleDate ?? new Date()) };
    case "unpublish":
      // Unpublishing a live post keeps its original date for a later re-publish; unscheduling clears it.
      return { status: "draft", publishedAt: live ? publishedAt : null };
    default:
      return { status, publishedAt };
  }
}

function noticeFor(action: SaveAction, previous: PostStatus, publishedAt: PostInput["publishedAt"], rebuilding: boolean) {
  const rebuildNote = rebuilding ? " The site is rebuilding; its SEO page updates in a few minutes." : "";
  switch (action) {
    case "publish":
      return (previous === "published" ? "Changes are live." : "Post published. It's on the blog now.") + rebuildNote;
    case "schedule": {
      const when = publishedAt instanceof Timestamp ? formatPostDate(publishedAt, true) : "the chosen time";
      return `Scheduled. It goes live on ${when}.`;
    }
    case "unpublish":
      return "Moved back to drafts. Readers can no longer see it." + rebuildNote;
    default:
      return previous === "draft" ? "Draft saved." : "Changes saved." + rebuildNote;
  }
}

function SaveIndicator({
  saving,
  dirty,
  lastSavedAt,
  isDraft,
}: {
  saving: SaveAction | null;
  dirty: boolean;
  lastSavedAt: Date | null;
  isDraft: boolean;
}) {
  const time = lastSavedAt?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  if (saving) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-slate-500">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Saving…
      </span>
    );
  }
  if (dirty) {
    return <span className="text-xs font-semibold text-amber-700">{isDraft ? "Unsaved changes" : "Unsaved changes · not live yet"}</span>;
  }
  return time ? <span className="text-xs text-slate-500">Saved · {time}</span> : null;
}

function GooglePreview({ title, slug, description }: { title: string; slug: string; description: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Google preview</p>
      <p className="mt-1.5 truncate text-xs text-slate-600">almuallimtravels.com › blog › {slug || "…"}</p>
      <p className="mt-0.5 line-clamp-1 text-base text-[#1a0dab]">{title || "Post title"} | AlMuallim Travels and Tours</p>
      <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{description || "Add an excerpt or SEO description."}</p>
    </div>
  );
}

const inputClass =
  "flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10";

function Panel({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("space-y-4 rounded-2xl border border-slate-200 bg-white p-5", className)}>
      <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-semibold">{label}</p>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

type ActionButtonProps = {
  onClick: () => void;
  busy: boolean;
  disabled: boolean;
  icon: typeof Save;
  variant?: "primary";
  children: React.ReactNode;
};

function ActionButton({ onClick, busy, disabled, icon: Icon, variant, children }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition disabled:opacity-60",
        variant === "primary"
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "border border-slate-200 bg-white text-foreground hover:bg-slate-50",
      )}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}
