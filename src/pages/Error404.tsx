import React from 'react';
import { Button } from 'antd';

const Error404: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl mt-4">Lo sentimos, la página que estás buscando no existe.</p>
      <Button type="primary" size="large" className="mt-8" href="/">
        Volver a la página de inicio
      </Button>
    </div>
  </div>
);

export default Error404;
