import { Outlet } from 'react-router-dom';
import HeaderAfterLogin from '../components/HeaderAfterLogin';

const UserLayout = ({ setIsLoggedIn, userInfo }) => {
  return (
    <>
      <HeaderAfterLogin setIsLoggedIn={setIsLoggedIn} userInfo={userInfo} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;