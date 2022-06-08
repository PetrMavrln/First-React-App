import PostService from 'API/PostsService';
import PostFilter from 'components/PostFilter';
import PostForm from 'components/PostForm';
import PostList from 'components/PostList';
import MyButton from 'components/UI/button/MyButton';
import Loader from 'components/UI/Loader/Loader';
import MyModal from 'components/UI/MyModal/MyModal';
import Pagination from 'components/UI/pagination/Pagination';
import MySelect from 'components/UI/select/MySelect';
import { getPageCount } from 'components/utils/pages';
import { useFetching } from 'hooks/useFetching';
import { useObserver } from 'hooks/useObserver';
import { usePosts } from 'hooks/usePost';
import React, { useEffect, useRef, useState } from 'react';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState({sort: '', query: ''});
  const [modal, setModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
  const lastElement = useRef();
  console.log(lastElement);

  const [fetchPosts, isPostsLoading, postError] = useFetching(async (limit, page) => {
    const response = await PostService.getAll(limit, page);
    setPosts([...posts, ...response.data]);
    const totalCount = response.headers['x-total-count'];
    setTotalPages(getPageCount(totalCount, limit));
  });
  
  useObserver(lastElement, page < totalPages, isPostsLoading, () => {
    setPage(page + 1);
  });

  useEffect(() => {
    fetchPosts(limit, page);
  }, [page, limit]);

  const createPost = (newPost) => {
    setPosts([...posts, newPost]);
    setModal(false);
  };

  // Получаем post из дочернего компонента
  const removePost = (post) => {
    setPosts(posts.filter(p => p.id !== post.id));
  };

  const changePage = (page) => {
    setPage(page);
  }

  return (
    <div className="App">
      <MyButton style={{marginTop: 30}} onClick={() => setModal(true)}>
        Создать пост
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost}/>
      </MyModal>
      
      <hr style={{margin: '15px 0'}}/>
      <PostFilter
        filter = {filter}
        setFilter = {setFilter}
      />
      <div style={{marginTop: 5}}>
        <MySelect
          value={limit}
          onChange={value => setLimit(value)}
          defaultValue='Кол-во элементов на странице'
          options={[
              {value: 5, name: '5'},
              {value: 10, name: '10'},
              {value: 15, name: '15'},
              {value: 20, name: '20'},
              {value: -1, name: 'Показать все'},
          ]}
        />
      </div>
      
      {postError &&
        <h1>Произошла ошибка ${postError}</h1>
      }
      <PostList remove={removePost}posts={sortedAndSearchedPosts} title='Посты про JS'/>
      <div ref={lastElement} style={{height: 1}}/>
      {isPostsLoading && 
         <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><h1><Loader/></h1></div>
      }

      {/* <Pagination 
        page={page} 
        changePage={changePage} 
        totalPages={totalPages}
      /> */}
    </div>
  );
}

export default Posts;