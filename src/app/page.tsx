import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          HealthVault 2.0
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl">
          Your secure, digital health record management system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
        {/* Feature Cards */}
        <FeatureCard
          title="Secure Storage"
          description="Store your health records securely with end-to-end encryption"
          icon="🔒"
        />
        <FeatureCard
          title="Easy Access"
          description="Access your records anytime, anywhere on any device"
          icon="📱"
        />
        <FeatureCard
          title="Share Safely"
          description="Share records securely with healthcare providers"
          icon="🤝"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/signup"
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="px-8 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
} 