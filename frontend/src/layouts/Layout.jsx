import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import CreatePost from "../components/CreatePost";

const Layout = () => {

    const [showCreatePost, setShowCreatePost] = useState(false);
    const [postsRefresh, setPostsRefresh] = useState(0);

    return (
        <div className="min-h-screen bg-gray-100 pt-16 pb-20">

            <Navbar
                onCreatePost={() => setShowCreatePost(true)}
            />

            <main>
                <Outlet context={{ postsRefresh }}/>
            </main>

            {showCreatePost && (
                <CreatePost
                    onClose={() => setShowCreatePost(false)}
                    onPostCreated={() => {
                        setShowCreatePost(false);
                        setPostsRefresh(
                            (value) => value + 1
                        );
                    }}
                />
            )}

            <BottomNav />

        </div>
    );
};

export default Layout;