import { useRouter } from 'next/navigation'
import { PathName } from "@/routers/types";

const useNextRouter = () => {
  const router = useRouter();

  const redirectTo = (path: PathName) => {
    router.push(path);
  };

  return { redirectTo };
};

export default useNextRouter;