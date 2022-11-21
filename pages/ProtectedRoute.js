import { appRoutes } from '../constants';
import { useAuthContext } from '../contexts';

const isBrowser = () => typeof window !== 'undefined';

const ProtectedRoute = ({ router, children }) => {

    const { user } = useAuthContext();
    const isAuthenticated = user.isLoggedIn;

    let unprotectedRoutes = {
        appRoutes.LOGIN_AGE,
        appRoutes.FORGET_PASSWORD,
        appRoutes.RESET_PASSWORD,
        appRoutes.EMAIL_SENT,
        appRoutes.NEWS_FEED_PAGE,
        appRoutes.CONTENT_DETAILS_PAGE,
        appRoutes.ABOUT_US_PAGE,
    };

    let pathIsProtected = unprotectedRoutes.indexOf(router.pathname) === -1;

    if (isBrowser) && !isAuthenticated && pathIsProtected) {
        router.push(appRoutes.LOGIN_PAGE);
    }
    return children;
};

export default ProtectedRoute;
