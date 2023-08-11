'use client'

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type E = {
    preventDefault(): unknown;
    code: string;
    e: React.MouseEvent<HTMLButtonElement>
}

const SearchComp = ({ placeHolder = "Search...", classNames, redirect }: { placeHolder?: string, classNames?: { container?: string, input?: string, button?: string }, redirect: string }) => {
    const [search, setSearch] = useState<string>("")
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handelSearchChange = (e: { target: { value: string; }; }) => {
        setSearch(e?.target?.value?.toLowerCase())
    }

    const handelSearch = (search: string) => {
        const value = search?.trim()?.replace(/\s/g, '-')
        return value
    }

    const handleSearchClick = (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (search.length >= 3) {
            const targetPath = `/${redirect}?q=${handelSearch(search)}`;
            if (`${pathname}?${searchParams}` !== targetPath) {
                router.push(targetPath);
            }
        }
    }

    return (
        <>
            <div className={cn(
                classNames?.container,
                "relative flex w-full max-w-sm flex-row items-center justify-end space-x-1")}
            >
                <Input className={cn("w-full placeholder:font-medium", classNames?.input)} placeholder={placeHolder} value={search?.replaceAll('-', ' ')} type="text" onChange={(e: any) => handelSearchChange(e)} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.code === "Enter") { handleSearchClick(e) } }} />
                <Button className={cn("absolute", classNames?.button)} onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleSearchClick(event)} variant={null}><Search /></Button>
            </div>
        </>
    );
}

export default SearchComp;