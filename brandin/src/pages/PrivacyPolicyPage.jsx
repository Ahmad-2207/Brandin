import React from "react";
import { Database, BrainCircuit, ShieldCheck, UserCheck, ArrowRight } from "lucide-react";
import LegalLayout from "../components/layout/LegalLayout";

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "data-collection", label: "Data Collection", icon: Database },
    { id: "ai-logic", label: "AI Matching Logic", icon: BrainCircuit },
    { id: "secure-payments", label: "Secure Payments", icon: ShieldCheck },
    { id: "user-rights", label: "User Rights", icon: UserCheck },
  ];

  return (
    <LegalLayout
      titleBlack="Your Privacy,"
      titleBlue="Curated with Care."
      description="At Brandly, we believe transparency is the foundation of every great partnership. This policy outlines how we protect your creator identity and brand data while powering your growth."
      lastUpdated="October 24, 2024"
      sections={sections}
    >
      {/* 1. Data Collection */}
      <section id="data-collection" className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#0f172a]">Data Collection</h2>
        </div>
        
        <p className="text-gray-500 leading-relaxed mb-8">
          We collect information that helps us build better matches. This includes your professional profile data, social media engagement metrics (via authorized APIs), and communication history within the Brandly ecosystem.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-bold text-[#0f172a] mb-2">Identity & Profile</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Name, email, portfolio links, and biographical information provided during onboarding.
            </p>
          </div>
          <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-50/50">
            <h3 className="font-bold text-[#0f172a] mb-2">Performance Data</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Publicly available reach, engagement rates, and audience demographics from linked platforms.
            </p>
          </div>
        </div>
      </section>

      {/* 2. AI Matching Logic */}
      <section id="ai-logic" className="bg-[#f5f3ff] rounded-[2rem] p-8 md:p-10 border border-purple-100 scroll-mt-32">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white text-purple-600 shadow-sm rounded-xl flex items-center justify-center">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#0f172a]">AI Matching Logic</h2>
        </div>

        <p className="text-gray-600 leading-relaxed mb-8">
          Our "Digital Curator" AI processes anonymized datasets to suggest high-conversion pairings between brands and creators. Here's how it works:
        </p>

        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white text-purple-600 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-[#0f172a]">Anonymized Processing:</strong> Your raw data is tokenized before entering the recommendation engine.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white text-purple-600 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-[#0f172a]">No Selling:</strong> We never sell your personal data to third-party advertisers. The AI is internal to Brandly only.
            </p>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-white text-purple-600 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-[#0f172a]">Logic Audits:</strong> We regularly audit our algorithms for bias to ensure fair opportunities for all creators.
            </p>
          </li>
        </ul>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 3. Secure Payments */}
        <section id="secure-payments" className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-black text-[#0f172a]">Secure Payments</h2>
          </div>
          
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            All financial transactions are processed through PCI-compliant gateways. Brandly does not store raw credit card or bank account details on our servers.
          </p>

          <div className="bg-emerald-50 text-emerald-700 text-sm font-bold px-4 py-3 rounded-xl flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            AES-256 Bit Encryption
          </div>
        </section>

        {/* 4. User Rights */}
        <section id="user-rights" className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 scroll-mt-32">
          <div className="flex items-center gap-3 mb-6">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-black text-[#0f172a]">User Rights</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
              <span className="text-sm font-bold text-gray-700">Right to Access</span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
              <span className="text-sm font-bold text-gray-700">Data Portability</span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group">
              <span className="text-sm font-bold text-gray-700">Account Deletion</span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        </section>
      </div>
    </LegalLayout>
  );
}
