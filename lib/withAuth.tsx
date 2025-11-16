"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "./useAuth";

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithAuthComponent: React.FC<P> = (props) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/login");
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!user) {
      return null; // Don't render anything while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
