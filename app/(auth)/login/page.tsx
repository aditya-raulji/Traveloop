'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col w-full"
    >
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-paper-dark border-2 border-dashed border-gold/40 rounded-full flex items-center justify-center mb-6 text-gold/60">
          <Camera size={32} strokeWidth={1.5} />
        </div>
        <h1 className="font-heading italic text-[48px] leading-tight text-earth mb-2">
          Welcome back
        </h1>
        <p className="font-body text-earth-muted text-base">
          Sign in to continue your journey
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm font-body text-earth-muted mb-2 ml-4">
            Email address
          </label>
          <Input 
            type="email" 
            placeholder="you@example.com"
            leftIcon={<Mail size={20} />}
            className={errors.email ? 'border-error focus:border-error focus:ring-error/15' : ''}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-error text-xs mt-2 ml-4">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2 ml-4 mr-4">
            <label className="block text-sm font-body text-earth-muted">
              Password
            </label>
            <Link href="/forgot-password" className="text-gold text-sm hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="••••••••"
            leftIcon={<Lock size={20} />}
            rightIcon={
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none hover:text-earth transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            }
            className={errors.password ? 'border-error focus:border-error focus:ring-error/15' : ''}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-error text-xs mt-2 ml-4">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-error/10 text-error text-sm rounded-2xl text-center border border-error/20">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full mt-2 flex justify-center items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Signing in...
            </>
          ) : (
            'Continue the journey →'
          )}
        </Button>
      </form>

      <div className="my-8 flex items-center justify-center gap-4 text-earth-muted/40">
        <div className="h-px bg-earth-muted/20 w-1/4"></div>
        <span className="text-sm font-body text-earth-muted/60">— or —</span>
        <div className="h-px bg-earth-muted/20 w-1/4"></div>
      </div>

      <Button 
        type="button" 
        variant="secondary" 
        className="w-full flex justify-center items-center gap-3"
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </Button>

      <p className="text-center mt-8 text-sm font-body text-earth-muted">
        New to Traveloop?{' '}
        <Link href="/register" className="text-gold font-medium hover:underline">
          Create account
        </Link>
      </p>
    </motion.div>
  );
}
