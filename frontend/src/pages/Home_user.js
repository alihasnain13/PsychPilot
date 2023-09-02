import { UserAuth } from '../context/AuthContext';
import '../styles/Home_user.css';
import BlogPost from "../components/postsComponent";
import Loading from "../components/loading";

function MainPage() {
  
  const { logOut, user } = UserAuth();

  if (!user) {

    return (

      <Loading prop = {'Loading...'}/>

     
);
    
  }else{
    
      return (
    
        <BlogPost userName = {user.displayName}/>
          
      );


  }
}

export default MainPage;
