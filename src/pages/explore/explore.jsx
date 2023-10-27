import { useCallback, useEffect, useState } from 'react';
import { SearchBar } from '../../components/navigation/search';
import { PostGrid } from '../../components/post/post-grid';
import {
 NavTemplate,
 SearchTemplate
} from '../../components/template/template';
import { api } from '../../api/axios';
import debounce from 'lodash.debounce';
import { Avatar } from '@chakra-ui/react';

export const ExplorePage = () => {
 const [search, setSearch] = useState('');
 const avatar_url = process.env.REACT_APP_API_IMAGE_AVATAR_URL;
 const [posts, setPosts] = useState([]);

 const debouncedFilter = useCallback(
  debounce((query) => setSearch(query), 500)
 );
 const doSearch = (query) => {
  if (!query) return setSearch('');
  debouncedFilter(query);
 };
 const [users, setUsers] = useState([]);

 const fetchPost = () => {
  api
   .get('/posts/search', {
    params: {
     search
    }
   })
   .then((res) => setPosts(res.data))
   .catch((err) => console.log(err));
 };
 const fetchUsers = () => {
  api
   .get('/auth/username2/', {
    params: {
     username: search
    }
   })
   .then((res) => setUsers(res.data))
   .catch((err) => console.log(err));
 };
 useEffect(() => {
  if (search) fetchUsers();
  else setUsers([]);
  fetchPost();
 }, [search]);

 return (
  <>
   <SearchTemplate doSearch={doSearch}>
    {users?.map((user, i) => (
     <a href={`/username/${user.username}`} className="w-full">
      <div
       key={i}
       className="flex w-full flex-wrap gap-1 text-black p-1 cursor-pointer"
      >
       {/* <b>{c.user.username}</b> */}
       <Avatar
        maxW="24px"
        maxH="24px"
        objectFit={'cover'}
        className="cursor-pointer"
        src={avatar_url + user.image_url}
       />{' '}
       {user.username}{' '}
      </div>
     </a>
    ))}
    <PostGrid posts={posts} />
   </SearchTemplate>
  </>
 );
};
