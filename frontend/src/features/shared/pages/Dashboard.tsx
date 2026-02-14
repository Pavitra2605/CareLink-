import { useAuth } from '@/hooks';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">CareLink</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Healthcare Management</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}!</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            You are logged in as a <strong>{user?.role}</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {user?.role === 'PATIENT' && (
              <>
                <div className="card-hover p-6">
                  <h3 className="text-lg font-semibold mb-2">Submit Triage</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Describe your symptoms and get severity assessment
                  </p>
                </div>
                <div className="card-hover p-6">
                  <h3 className="text-lg font-semibold mb-2">Request Consultation</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Book a consultation with an available doctor
                  </p>
                </div>
                <div className="card-hover p-6">
                  <h3 className="text-lg font-semibold mb-2">View Timeline</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Track all your medical events and history
                  </p>
                </div>
              </>
            )}

            {user?.role === 'DOCTOR' && (
              <>
                <div className="card-hover p-6">
                  <h3 className="text-lg font-semibold mb-2">Consultation Queue</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    View and manage your patient consultations
                  </p>
                </div>
                <div className="card-hover p-6">
                  <h3 className="text-lg font-semibold mb-2">Medical Records</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Create and manage patient medical records
                  </p>
                </div>
                <div className="card-hover p-6">
                  <h3 className="text-lg font-semibold mb-2">Schedule</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    View your upcoming consultations and schedule
                  </p>
                </div>
              </>
            )}

            {user?.role === 'ADMIN' && (
              <>
                <div className="card-hover p-6">
                  <h3 className="text-lg font-semibold mb-2">Dashboard Analytics</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    View system-wide metrics and statistics
                  </p>
                </div>
                <div className="card-hover p-6">
                  <h3 className="text-lg font-semibold mb-2">Emergency Management</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Monitor and manage emergency events
                  </p>
                </div>
                <div className="card-hover p-6">
                  <h3 className="text-lg font-semibold mb-2">System Settings</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Configure system settings and permissions
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">ℹ️ Getting Started</h3>
            <p className="text-blue-800 dark:text-blue-200">
              CareLink is fully operational. Complete feature modules are being developed for your role.
              More features coming soon!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
