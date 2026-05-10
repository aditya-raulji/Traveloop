'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Camera, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const registerSchema = z.object({
  firstName: z.string().min(2, "First name required"),
  lastName: z.string().min(2, "Last name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().max(300, "Max 300 characters").optional(),
  password: z.string().min(8, "Min 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          name: `${data.firstName} ${data.lastName}`,
          image: photoPreview
        })
      });

      const resultData = await res.json();

      if (!res.ok) {
        setError(resultData.message || "Registration failed");
        return;
      }

      setSuccess("Welcome to Traveloop! Your journey begins now.");
      
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!signInResult?.error) {
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
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
      className="flex flex-col w-full py-8"
    >
      <div className="text-center mb-8">
        <h1 className="font-heading italic text-[48px] leading-tight text-earth mb-2">
          Begin your story
        </h1>
        <p className="font-body text-earth-muted text-base">
          Create your Traveloop account
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="w-[100px] h-[100px] rounded-full bg-paper-dark border-2 border-dashed border-gold/40 flex flex-col items-center justify-center cursor-pointer hover:border-gold hover:bg-gold/5 transition-all overflow-hidden relative group"
        >
          {photoPreview ? (
            <>
              <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
            </>
          ) : (
            <>
              <Camera size={24} className="text-gold/60 mb-1" />
              <span className="text-[10px] font-body text-gold/60 uppercase tracking-wider">Add photo</span>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handlePhotoChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 text-error text-sm rounded-2xl text-center border border-error/20">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-success/10 text-success text-sm rounded-2xl text-center border border-success/20">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Input placeholder="First Name" className={errors.firstName ? 'border-error' : ''} {...register('firstName')} />
            {errors.firstName && <p className="text-error text-xs mt-1 ml-4">{errors.firstName.message}</p>}
          </div>
          <div>
            <Input placeholder="Last Name" className={errors.lastName ? 'border-error' : ''} {...register('lastName')} />
            {errors.lastName && <p className="text-error text-xs mt-1 ml-4">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Input type="email" placeholder="Email Address" className={errors.email ? 'border-error' : ''} {...register('email')} />
            {errors.email && <p className="text-error text-xs mt-1 ml-4">{errors.email.message}</p>}
          </div>
          <div>
            <Input type="tel" placeholder="Phone Number" {...register('phone')} />
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Input placeholder="City" {...register('city')} />
          </div>
          <div>
            <Input placeholder="Country" {...register('country')} />
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Input type="password" placeholder="Password" className={errors.password ? 'border-error' : ''} {...register('password')} />
            {errors.password && <p className="text-error text-xs mt-1 ml-4">{errors.password.message}</p>}
          </div>
          <div>
            <Input type="password" placeholder="Confirm Password" className={errors.confirmPassword ? 'border-error' : ''} {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-error text-xs mt-1 ml-4">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        {/* Row 5 */}
        <div>
          <textarea
            placeholder="Additional Information / Bio"
            className={`w-full min-h-[100px] bg-white/70 border ${errors.bio ? 'border-error' : 'border-[#D8CBB8]'} rounded-[20px] p-6 font-body text-earth focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/15 placeholder:text-earth-muted/60 transition-all resize-y`}
            {...register('bio')}
          />
          {errors.bio && <p className="text-error text-xs mt-1 ml-4">{errors.bio.message}</p>}
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full mt-4 flex justify-center items-center gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <><Loader2 className="animate-spin" size={18} /> Creating account...</>
          ) : (
            'Start your adventure →'
          )}
        </Button>
      </form>

      <p className="text-center mt-8 text-sm font-body text-earth-muted pb-8">
        Already have an account?{' '}
        <Link href="/login" className="text-gold font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
