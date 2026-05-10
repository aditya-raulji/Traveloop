'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col w-full"
    >
      <Link href="/login" className="inline-flex items-center gap-2 text-sm text-earth-muted hover:text-earth mb-8 transition-colors">
        <ArrowLeft size={16} />
        Back to login
      </Link>

      <div className="text-center mb-8">
        <h1 className="font-heading italic text-[48px] leading-tight text-earth mb-2">
          Reset your password
        </h1>
        <p className="font-body text-earth-muted text-base">
          Enter your email and we'll send you a link
        </p>
      </div>

      {submitted ? (
        <div className="p-6 bg-success/10 border border-success/20 rounded-[24px] text-center">
          <h3 className="font-heading italic text-2xl text-success mb-2">Check your email</h3>
          <p className="font-body text-success/80 text-sm">
            If this email exists, you'll receive a link shortly to reset your password.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-body text-earth-muted mb-2 ml-4">
              Email address
            </label>
            <Input 
              type="email" 
              placeholder="you@example.com"
              leftIcon={<Mail size={20} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="primary" className="w-full">
            Send reset link
          </Button>
        </form>
      )}
    </motion.div>
  );
}
