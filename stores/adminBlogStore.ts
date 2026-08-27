import { create } from "zustand";
import { deleteBlog } from "@/app/admin/actions/blogs";
import type { BlogPost } from "@/lib/types";

interface AdminBlogStore {
    posts: BlogPost[];
    hydrated: boolean;
    /** Seeds/refreshes the list from a fresh server fetch. */
    hydrate: (posts: BlogPost[]) => void;
    /** Reflects a just-created post immediately, without a server refetch. */
    addPost: (post: BlogPost) => void;
    /** Reflects a just-edited post immediately, without a server refetch. */
    updatePost: (post: BlogPost) => void;
    /** Optimistic: removes immediately, rolls back on server error. */
    deletePost: (id: string) => Promise<{ error?: string }>;
}

function dedupeById(posts: BlogPost[]): BlogPost[] {
    const seen = new Set<string>();
    const result: BlogPost[] = [];
    for (const post of posts) {
        if (seen.has(post.id)) continue;
        seen.add(post.id);
        result.push(post);
    }
    return result;
}

export const useAdminBlogStore = create<AdminBlogStore>((set, get) => ({
    posts: [],
    hydrated: false,

    hydrate: (posts) => set({ posts: dedupeById(posts), hydrated: true }),

    // Guards against React's "two children with the same key" warning if
    // addPost ever fires for a post that's already in the list (e.g. a
    // stale server refetch landing right after an optimistic add).
    addPost: (post) =>
        set((state) => ({
            posts: state.posts.some((existing) => existing.id === post.id) ? state.posts : [post, ...state.posts],
        })),

    updatePost: (post) =>
        set((state) => ({
            posts: state.posts.map((existing) => (existing.id === post.id ? post : existing)),
        })),

    deletePost: async (id) => {
        const previous = get().posts;
        set({ posts: previous.filter((post) => post.id !== id) });

        const result = await deleteBlog(id);
        if (result.error) set({ posts: previous });
        return result;
    },
}));
