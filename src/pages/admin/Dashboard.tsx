import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-serif font-semibold">Admin Dashboard</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <div className="rounded-xl border bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <h2 className="font-medium">Properties</h2>
              <span className="inline-flex h-6 px-2 rounded-full text-xs items-center bg-brand-red/10 text-brand-red">
                Manage
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              Create, update and organize property listings, images and features.
            </p>
            <Button asChild className="bg-brand-red hover:bg-brand-red/90 text-white">
              <Link to="/admin/properties">Manage Properties</Link>
            </Button>
          </div>

          <div className="rounded-xl border bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <h2 className="font-medium">Inquiries</h2>
              <span className="inline-flex h-6 px-2 rounded-full text-xs items-center bg-brand-red/10 text-brand-red">
                Review
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              Review and respond to customer messages sent via the website.
            </p>
            <Button asChild className="bg-brand-red hover:bg-brand-red/90 text-white">
              <Link to="/admin/inquiries">View Inquiries</Link>
            </Button>
          </div>

          <div className="rounded-xl border bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <h2 className="font-medium">Account</h2>
              <span className="inline-flex h-6 px-2 rounded-full text-xs items-center bg-brand-red/10 text-brand-red">
                Session
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              You are signed in. Use the button below to end your session securely.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
