import BottomTabNav from '../components/BottomTabNav';
import useIsMobile from '../utils/useIsMobile';
import { Outlet } from 'react-router';

const MainLayout = () => {
  const isMobile = useIsMobile();

  return (
    <div className="flex-1 relative ">
      <Outlet />
      {isMobile && <BottomTabNav />}
    </div>
  );
};

export default MainLayout;
