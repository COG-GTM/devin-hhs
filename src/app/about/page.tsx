export default function AboutPage() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">ABOUT</h1>
          <p className="text-gray-600 mt-2">
            Full transparency into Medicaid provider spending.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">Mission</h2>
          <div className="border-2 border-black p-6">
            <p className="text-lg leading-relaxed">
              DEVIN//HHS provides unprecedented transparency into Medicaid provider spending. 
              This platform transforms 227 million healthcare spending records into accessible, 
              searchable information for researchers, policymakers, and the public.
            </p>
          </div>
        </section>

        {/* Data Source */}
        <section className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">Data Source</h2>
          <div className="border-2 border-black p-6">
            <p className="mb-4">
              All data is sourced directly from <strong>opendata.hhs.gov</strong> — the official 
              U.S. Department of Health & Human Services open data portal.
            </p>
            <ul className="space-y-2 text-sm">
              <li>• <strong>227+ million</strong> provider spending records</li>
              <li>• <strong>All 50 states</strong> and territories</li>
              <li>• <strong>Complete NPI</strong> billing and servicing provider data</li>
              <li>• <strong>HCPCS codes</strong> with utilization metrics</li>
              <li>• <strong>Monthly claims</strong> with beneficiary counts</li>
            </ul>
            <div className="mt-6">
              <a 
                href="https://opendata.hhs.gov" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm underline hover:text-gray-600"
              >
                Visit opendata.hhs.gov →
              </a>
            </div>
          </div>
        </section>

        {/* Technical Stack */}
        <section className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">Technical Stack</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-black p-6">
              <h3 className="font-bold mb-3">Frontend</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Next.js 15</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Server Components</li>
              </ul>
            </div>
            <div className="border-2 border-black p-6">
              <h3 className="font-bold mb-3">Backend</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>TimescaleDB</li>
                <li>PostgreSQL</li>
                <li>REST API</li>
                <li>Vercel Edge</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Build Story */}
        <section className="mb-12">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">Build Story</h2>
          <div className="border-2 border-black p-6 bg-gray-50">
            <p className="mb-4">
              This transparency platform was built using <strong>Devin CLI</strong> — 
              demonstrating AI-assisted development for complex, data-intensive applications.
            </p>
            <p className="text-sm text-gray-600">
              From database design to frontend implementation to deployment, 
              Devin accelerated development while maintaining production-quality code.
            </p>
          </div>
        </section>

        {/* Links */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">Links</h2>
          <div>
            <a 
              href="https://opendata.hhs.gov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border-2 border-black p-4 hover:bg-black hover:text-white transition-colors block max-w-md"
            >
              <h3 className="font-bold mb-1">HHS Open Data</h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-300">Official data source</p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
