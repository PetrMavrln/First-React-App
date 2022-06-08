import PostService from 'API/PostsService';
import Loader from 'components/UI/Loader/Loader';
import { useFetching } from 'hooks/useFetching';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PostIdPage = () => {
    const params = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [fecthPostById, isLoading, error] = useFetching( async (id) => {
        const response = await PostService.getById(id);
        setPost(response.data);
    });

    const [fecthComments, isComLoading, comError] = useFetching( async (id) => {
        const response = await PostService.getCommentsByPostId(id);
        setComments(response.data);
    });

    useEffect( () => {
        fecthPostById(params.id);
        fecthComments(params.id);
    }, []);

    return (
        <div>
            <h1>Вы открыли страницу поста с ID = {params.id}</h1>
            {isLoading
                ? <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><h1><Loader/></h1></div>
                : <div>{post.id}. {post.title}</div>
            }
            <h1>Комментарии</h1>
            {isComLoading
                ? <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}}><h1><Loader/></h1></div>
                : <div>
                    {comments.map(comm => 
                      <div key={comm.id} style={{marginTop: 15}}>
                          <h5>{comm.email}</h5>
                          <div>{comm.body}</div>
                      </div>  
                    )}
                  </div>
            }
        </div>
    );
};

export default PostIdPage;