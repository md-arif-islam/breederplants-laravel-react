import React, { useEffect, useState } from "react";
import { usePostStore } from "../store/usePostStore";
import { useParams, Link } from "react-router-dom";
import { Calendar, Leaf, Share2 } from "lucide-react";
import PostCard from "../components/PostCard";

const PublicNewsViewPage = () => {
    const { currentPost, isLoading, getPost, getRelatedPosts } = usePostStore();
    const [imgLoaded, setImgLoaded] = useState(false);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        getPost(id);
    }, [getPost, id]);

    useEffect(() => {
        document.title = currentPost?.title
            ? `${currentPost.title} | Breederplants News`
            : "Beautiful News - Breederplants";
    }, [currentPost?.title]);

    useEffect(() => {
        if (currentPost && currentPost.tags && currentPost.tags.length > 0) {
            // use the first tag as filter; you can adjust the logic as needed.
            getRelatedPosts(currentPost.tags[0].id).then((posts) => {
                // Optionally filter out the current post and limit to 3 results.
                setRelatedPosts(
                    posts
                        .filter((post) => post.id !== currentPost.id)
                        .slice(0, 3)
                );
            });
        }
    }, [currentPost, getRelatedPosts]);

    const thumbnailUrl = currentPost?.thumbnail
        ? `${import.meta.env.VITE_API_URL}/${currentPost.thumbnail}`
        : "/placeholder.svg?height=600&width=1200";

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
            return "Today";
        } else if (diffDays === 1) {
            return "Yesterday";
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else if (diffDays < 30) {
            return `${Math.floor(diffDays / 7)} weeks ago`;
        } else {
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }
    };

    const handleShare = async () => {
        if (navigator.share && currentPost) {
            try {
                await navigator.share({
                    title: currentPost.title,
                    url: window.location.href,
                });
            } catch (error) {
                console.error("Error sharing:", error);
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    if (isLoading || !currentPost) {
        return (
            <div className="bg-gray-50 min-h-screen pt-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Skeleton loading state */}
                        <div className="w-full h-[400px] bg-gray-200 animate-pulse"></div>
                        <div className="p-6 space-y-4">
                            <div className="h-10 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                            <div className="flex items-center space-x-2">
                                <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-full"></div>
                                <div className="h-4 w-40 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                            <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                            <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded"></div>
                            <div className="flex space-x-2 pt-4">
                                <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full"></div>
                                <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 -mt-12 ">
            {/* Content */}
            <div className="container mx-auto">
                <div className="-mt-12 z-10 relative">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        {/* Hero Image */}
                        <div className="relative w-full overflow-hidden bg-gray-100">
                            {!imgLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                    <Leaf className="w-12 h-12 text-gray-300 animate-pulse" />
                                </div>
                            )}
                            <img
                                src={thumbnailUrl || "/placeholder.svg"}
                                alt={currentPost.title}
                                loading="lazy"
                                onLoad={() => setImgLoaded(true)}
                                className={`w-full h-auto max-h-[500px] object-cover transition-opacity duration-500 ${
                                    imgLoaded ? "opacity-100" : "opacity-0"
                                }`}
                            />
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                {/* Categories */}
                                <div className="flex flex-wrap gap-2">
                                    {currentPost.categories &&
                                    currentPost.categories.length > 0
                                        ? currentPost.categories.map((cat) => (
                                              <Link
                                                  key={cat.id}
                                                  to={`/categories/${cat.slug}`}
                                              >
                                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                                      {cat.name}
                                                  </span>
                                              </Link>
                                          ))
                                        : null}
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl font-bold text-gray-800 leading-tight md:text-4xl">
                                    {currentPost.title}
                                </h1>

                                {/* Author and Date */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                                                    currentPost.user?.email ||
                                                    "BP"
                                                }`}
                                                alt="Author"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <span>
                                            {currentPost.user?.email?.split(
                                                "@"
                                            )[0] || "Breederplants Team"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span
                                            title={formatDate(
                                                currentPost.created_at
                                            )}
                                        >
                                            {formatDate(currentPost.created_at)}
                                        </span>
                                    </div>
                                    <button
                                        className="ml-auto inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="mt-8 prose max-w-none">
                                <div
                                    className="mt-6 rounded-lg overflow-hidden news-desc"
                                    style={{ lineHeight: "1.6" }} // Add line height for better readability
                                    dangerouslySetInnerHTML={{
                                        __html: currentPost.description,
                                    }}
                                />
                            </div>

                            {/* Tags */}
                            {currentPost.tags &&
                                currentPost.tags.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-gray-100">
                                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                                            Related Topics
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {currentPost.tags.map((tag) => (
                                                <Link
                                                    key={tag.id}
                                                    to={`/tags/${tag.slug}`}
                                                >
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                                        {tag.name}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-12 mb-16">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                More from Breederplants
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedPosts.map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicNewsViewPage;
