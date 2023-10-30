/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
import { ModalDetailPost } from "./post-detail-modal";

export const PostGrid = ({ posts = [] }) => {
  console.log(posts);
  return (
    <div className="post-grid grid grid-cols-3">
      {posts?.map((post, key) => (
        <PostGridCard post={post} key={key} />
      ))}
    </div>
  );
};

const PostGridCard = ({ post }) => {
  const post_url = process.env.REACT_APP_API_IMAGE_POST_URL;
  console.log(post);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <img src={post_url + post.image_url} onClick={() => setIsOpen(true)} />
    </>
  );
};
