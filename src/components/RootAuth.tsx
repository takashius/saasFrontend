import { Outlet } from "react-router-dom"
import { useState } from 'react'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

const RootAuth = () => {
  const [client] = useState(new QueryClient())

  return (
    <QueryClientProvider client={client}>
      <Outlet />
    </QueryClientProvider>
  );
};

export default RootAuth;
