import { useRouter } from "next/router";

interface HiderProps {
  routes: string[];
  children: React.ReactNode | null | any;
}

const Hider: React.FC<HiderProps> = ({ routes, children }) => {
  const router = useRouter();

  if (!router) {
    return null;
  }

  const currentPath = router.asPath.split("?")[0].split("#")[0];
  const currentPathSegments = currentPath.split("/").filter((segment) => segment !== "");
  const shouldHide = routes.some((route) => {
    const routeSegments = route.split("/").filter((segment) => segment !== "");
    return currentPathSegments[0] === routeSegments[0];
  });

  return shouldHide ? null : children;
};

export default Hider;