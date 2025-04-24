import { Outlet } from 'react-router-dom';
import HeaderAfterLogin from '../components/HeaderAfterLogin';

const UserLayout = () => {
  return (
    <>
      <HeaderAfterLogin />  
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;
