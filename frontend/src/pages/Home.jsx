import { useState } from "react";
import CreatePost from "./createPost";
import Posts from "../components/Posts";

function Home() {
    const [feedType, setFeedType] = useState("forYou");
    const [newPost, setNewPost] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    return (
        <div className="flex-grow mr-auto border-r border-gray-300 min-h-screen">
            {/* TODO: HEADER COMPONENT */}

            <div className="flex w-full border-b border-gray-300">
                <div
                    className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
                    onClick={() => feedType !== "forYou" && setFeedType("forYou")}
                    role="button"
                    aria-selected={feedType === "forYou"}
                >
                    For You
                    {feedType === "forYou" && (
                        <div className="absolute bottom-0 w-20 h-1 rounded-full bg-primary bg-blue-600"></div>
                    )}
                </div>
                <div
                    className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
                    onClick={() => feedType !== "following" && setFeedType("following")}
                    role="button"
                    aria-selected={feedType === "following"}
                >
                    Following
                    {feedType === "following" && (
                        <div className="absolute bottom-0 w-20 h-1 rounded-full bg-blue-600"></div>
                    )}
                </div>
            </div>

            <CreatePost setNewPost={setNewPost} />

            <Posts feedType={feedType} newPost={newPost} setNewPost={setNewPost} />

        </div>
    );
}

export default Home;


//Has 3 sections

//1: div for 'for you' 'following'

//2: CreatePost section---if a new post is created, setNewPost will set 
//newPost to true and Home will be re-rendered w new values

//3: Posts depending on the feedtype
//different backend APIs for all posts and following 
//
