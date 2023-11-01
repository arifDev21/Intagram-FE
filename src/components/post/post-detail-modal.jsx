import { Stack } from '@chakra-ui/react';
import { Close } from '../../assets/icons';
import { ModalTemplate, Template } from '../template/template';
import { PostCard } from './post-card';
import { PostList } from './post-list';

const modalContentStyle = {
  height: '80%',
  overflowY: 'auto',
};

export const ModalDetailPost = ({ posts, isOpen, onClose }) => {
  return (
    <ModalTemplate isOpen={isOpen} title="Semua Postingan">
      <Template>
        <div className="w-full h-screen bg-white">
          <div className="w-full">
            <div className="flex justify-between m-3">
              <Close width={'16px'} onClick={onClose} />
            </div>
          </div>
          <div style={{ ...modalContentStyle }}>
            <Stack h={400}>
              {' '}
              <div className="flex flex-wrap justify-center">
                <PostList posts={posts} />
              </div>
            </Stack>
          </div>
        </div>
      </Template>
    </ModalTemplate>
  );
};
