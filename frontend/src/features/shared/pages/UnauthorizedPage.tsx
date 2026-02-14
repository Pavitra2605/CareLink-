import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-yellow-600 mb-2">403</h1>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Access Denied
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          You don't have permission to access this resource.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-primary w-full"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
