import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Pencil, Trash2 } from "lucide-react";

export default function PostCard({ post }) {
    const [imgLoaded, setImgLoaded] = useState(false);

    const thumbnailUrl = post?.thumbnail
        ? `${import.meta.env.VITE_API_URL}/${post.thumbnail}`
        : "/placeholder.svg";
    return (
        <Link
            to={`/news/${post.id}`}
            className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition border border-[#E9E9E9] my-2"
        >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                {/* Show placeholder until image loads */}
                {!imgLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <Leaf className="w-8 h-8 text-gray-400 animate-pulse" />
                    </div>
                )}
                <img
                    src={thumbnailUrl}
                    alt={post.title}
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
                        imgLoaded ? "opacity-100" : "opacity-0"
                    }`}
                />
            </div>

            <h2 className="text-xl font-semibold mt-4 mb-2">{post.title}</h2>
            <p className="text-gray-700">
                {post.summary ||
                    (post.description && post.description.length > 100
                        ? post.description.substring(0, 100) + "..."
                        : post.description)}
            </p>
        </Link>
    );
}
