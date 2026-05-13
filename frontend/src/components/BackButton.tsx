"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/utils/utils';
import type { BackButtonProps } from '../types/BackButtonProps';

const BackButton = ({ to, className, ...props }: BackButtonProps) => {
  const router = useRouter();

  const buttonContent = (
    <>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back
    </>
  );

  const buttonClassName = cn("font-bold", className);

  if (to) {
    return (
      <Button asChild variant="destructive" className={buttonClassName} {...props}>
        <Link href={to}>{buttonContent}</Link>
      </Button>
    );
  }

  return (
    <Button
      variant="destructive"
      onClick={() => router.back()}
      className={buttonClassName}
      {...props}
    >
      {buttonContent}
    </Button>
  );
};

export default BackButton;
