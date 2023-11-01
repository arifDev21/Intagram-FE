import { useCallback, useEffect, useState } from 'react';
import { SearchBar } from '../../components/navigation/search';
import { PostGrid } from '../../components/post/post-grid';
import { SearchTemplate } from '../../components/template/template';
import { api } from '../../api/axios';
import debounce from 'lodash.debounce';
import { Avatar } from '@chakra-ui/react';
import { ModalDetailPost } from '../../components/post/post-detail-modal';

export const ExplorePage = () => {
  const [search, setSearch] = useState('');
  const avatar_url = process.env.REACT_APP_API_IMAGE_AVATAR_URL;
  const [posts, setPosts] = useState([]);
  const [isSearchPage, setIsSearchPage] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

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
          search,
        },
      })
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  };
  const fetchUsers = () => {
    api
      .get('/auth/username2/', {
        params: {
          username: search,
        },
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
    setIsSearchPage(true); // Set isSearchPage to true when the modal is open
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsSearchPage(false); // Set isSearchPage to false when the modal is closed
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
          <a href={`/username/${user.username}`} className="w-full" key={i}>
            <div className="flex w-full flex-wrap gap-1 text-black p-1 cursor-pointer">
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
      <button onClick={openModal}>Open Modal</button>{' '}
      {/* Add a button to open the modal */}
      <ModalDetailPost
        posts={posts}
        isOpen={isModalOpen} // Set the isOpen prop based on isModalOpen
        onClose={closeModal} // Close the modal when it's closed
        isSearchPage={isSearchPage}
      />
    </>
  );
};
