import React from 'react';
import '../styles/post.css'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom';
import TypewriterAnimation from '../pages/textAnimation';

const BlogPost = ({userName}) => {

    const navigate= useNavigate();

    const linked=()=>{

        navigate('https://www.verywellmind.com/kendra-cherry-2794702');
    }
    return (
        <>
        <Navbar NavItem1="Home" NavItem2="Conversations" NavItem3="Plan" />

            <div className="container">

            <TypewriterAnimation userName = {userName}/>

                {/* <h2>Post</h2> */}
                <div className="blog-post">
                    <div className="blog-post_img">
                        <img src="https://images.unsplash.com/photo-1551847677-dc82d764e1eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80" alt="" />
                    </div>
                    <div className="blog-post_info">
                        <div className="blog-post_date">
                        <span onClick={ linked } >Kendra Cherry, MSEd</span>
                            <span>December 16, 2021</span>
                        </div>
                        <h1 className="blog-post_title">Motivational Enhancement Therapy</h1>
                        <p className="blog-post_text">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores a, tempore veniam quasi sint fugiat
                            facilis, facere, amet magnam optio velit. Laudantium et temporibus soluta, esse cupiditate aliquid
                            dicta accusantium.
                        </p>
                        <a href="https://www.verywellmind.com/motivational-enhancement-therapy-definition-techniques-and-efficacy-5212830" className="blog-post_cta">Read More</a>
                    </div>
                </div>

                <div className="blog-post">
                    <div className="blog-post_img">
                        <img src="https://images.unsplash.com/photo-1551847677-dc82d764e1eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80" alt="" />
                    </div>
                    <div className="blog-post_info">
                        <div className="blog-post_date">
                        <span onClick={ linked } >Kendra Cherry, MSEd</span>
                            <span>December 16, 2021</span>
                        </div>
                        <h1 className="blog-post_title">Motivational Enhancement Therapy</h1>
                        <p className="blog-post_text">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores a, tempore veniam quasi sint fugiat
                            facilis, facere, amet magnam optio velit. Laudantium et temporibus soluta, esse cupiditate aliquid
                            dicta accusantium.
                        </p>
                        <a href="https://www.verywellmind.com/motivational-enhancement-therapy-definition-techniques-and-efficacy-5212830" className="blog-post_cta">Read More</a>
                    </div>
                </div>
            </div>
        </>

    );
};

export default BlogPost;
