'use client';

import { motion } from 'framer-motion';
import {
  Clock,
  MapPin,
  Code,
  Mail,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { portfolioData } from '@/lib/data';
import TypewriterText from '@/components/TypewriterText';
import ChatMessages from '@/components/ChatMessages';

// High-fidelity brand SVGs for prominent visibility
function LinkedInIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 0 0-1.64 1.63 1.64 1.64 0 0 0 1.64 1.63 1.64 1.64 0 0 0 1.63-1.63c0-.9-.73-1.63-1.63-1.63Z" />
    </svg>
  );
}

function GitHubIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
      />
    </svg>
  );
}

function GmailIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

export default function ContactPage() {
  const contact = portfolioData.contact;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4"
    >
      {/* Header with Live badge */}
      <div className="flex items-center gap-3 mb-8">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl font-bold text-zinc-900 dark:text-white"
        >
          Let&apos;s Connect
        </motion.h2>
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold px-3 py-1 rounded-full shadow-2xs"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </motion.span>
      </div>

      {/* Primary Contact Channels - Visible Badges with Logos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Email */}
        <a
          href={`mailto:${contact.email}`}
          className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 hover:border-red-300 dark:hover:border-red-900/60 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <GmailIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Email</p>
            <p className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white truncate">
              {contact.email}
            </p>
          </div>
        </a>

        {/* Phone */}
        <a
          href={`tel:${contact.phone}`}
          className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 hover:border-emerald-300 dark:hover:border-emerald-900/60 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <Phone className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Phone</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
              {contact.phone}
            </p>
          </div>
        </a>

        {/* LinkedIn */}
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-900/60 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-blue-600/10 text-[#0A66C2] dark:text-[#388fed] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <LinkedInIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">LinkedIn</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate flex items-center gap-1">
              Mirza Julkawsar
              <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-blue-500" />
            </p>
          </div>
        </a>

        {/* GitHub */}
        <a
          href={contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 hover:shadow-md transition-all cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-zinc-900/10 dark:bg-zinc-100/10 text-zinc-900 dark:text-zinc-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
            <GitHubIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">GitHub</p>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate flex items-center gap-1">
              Mirza-pranto
              <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200" />
            </p>
          </div>
        </a>
      </div>

      {/* Info grid & Interactive Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Availability & Location summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-center">
              <Clock className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">
                Availability
              </p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {contact.duration} ({contact.status})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium">
                Location
              </p>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {contact.location}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-center flex-shrink-0">
              <Code className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-medium mb-1.5">
                Core Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {contact.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Small Embedded Map for Gulshan-1, Dhaka */}
        <div className="relative rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800/40 shadow-xs h-48 md:h-full min-h-[190px]">
          <iframe
            title="Gulshan 1, Dhaka Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14606.070624029252!2d90.4071427!3d23.7788104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7715a40c603%3A0xec01cd75f2b24237!2sGulshan-1%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1715000000000!5m2!1sen!2sbd"
            className="w-full h-full border-0 filter grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute bottom-2.5 left-2.5 pointer-events-none bg-white/95 dark:bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-700/80 text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            Gulshan 1, Dhaka
          </div>
        </div>
      </div>

      {/* What I bring */}
      <div className="mb-6 max-w-3xl">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
          What I Bring
        </h3>
        <TypewriterText
          text={contact.whatIBring}
          speed={4}
          className="text-zinc-600 dark:text-zinc-300 text-base md:text-lg leading-relaxed"
        />
      </div>

      {/* Goal */}
      <div className="mb-8 max-w-3xl">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
          Goal
        </h3>
        <TypewriterText
          text={contact.goal}
          speed={4}
          className="text-zinc-600 dark:text-zinc-300 text-base md:text-lg leading-relaxed"
        />
      </div>

      {/* Direct CTA */}
      <div className="flex flex-col items-center text-center mt-10">
        <motion.a
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          href={`mailto:${contact.email}`}
          className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-2xl px-8 py-3.5 text-sm font-semibold shadow-md transition-colors mb-4 cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          Send an Email ({contact.email})
        </motion.a>
      </div>

      <ChatMessages />
    </motion.div>
  );
}
