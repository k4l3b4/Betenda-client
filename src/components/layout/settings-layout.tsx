import React from 'react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-[calc(100vh-64px)] w-screen p-2'>
            <div className="flex flex-row h-full rounded-md bg-foreground p-3 gap-2">
                <aside className='w-56'>
                    <h1 className="text-4xl font-extrabold">Settings</h1>
                    <div className='my-4'>
                        <Link href="/settings" className={`${buttonVariants({ variant: "ghost", className: "my-2 text-xl no-underline w-full font-bold" })}`}>
                            <p className="w-full text-start">Profile</p>
                        </Link>
                        <Separator className="opacity-50" />
                        <Link href="/settings/privacy" className={`${buttonVariants({ variant: "ghost", className: "my-2 text-xl no-underline w-full font-bold" })}`}>
                            <p className="w-full text-start">Privacy</p>
                        </Link>
                        <Separator className="opacity-50" />
                        <Link href="/settings/password" className={`${buttonVariants({ variant: "ghost", className: "my-2 text-xl no-underline w-full font-bold" })}`}>
                            <p className="w-full text-start">Password</p>
                        </Link>
                        <Separator className="opacity-50" />
                        <Link href="/settings/security" className={`${buttonVariants({ variant: "ghost", className: "my-2 text-xl no-underline w-full font-bold" })}`}>
                            <p className="w-full text-start">Security</p>
                        </Link>
                    </div>
                </aside>
                <Separator orientation='vertical' />
                <main>{children}</main>
            </div>
        </div>
    );
};

export default SettingsLayout;