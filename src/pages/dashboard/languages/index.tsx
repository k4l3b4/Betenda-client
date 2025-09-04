import { getLanguages } from "@/api/requests/contributions/requests";
import DataError from "@/components/app-ui-states/data-error";
import DataLoading from "@/components/app-ui-states/data-loading";
import NoData from "@/components/app-ui-states/no-data";
import Meta from "@/components/meta/meta";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { LanguageType } from "@/types/contributions";
import { useQuery } from "@tanstack/react-query";
import { Edit2Icon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

const Languages = () => {
    const { data, isLoading, isError, refetch, isRefetching } = useQuery({ queryKey: ['languages'], queryFn: getLanguages })
    const languages = data?.data as LanguageType[]

    return (
        <div suppressHydrationWarning className="w-full h-full flex justify-center pt-4 p-1">
            <Meta title="Registered languages" />
            <div className="w-full max-w-[800px]">
                <Table className="w-full">
                    <TableCaption>A list of registered languages.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Language</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>ISO</TableHead>
                            <TableHead>GLOTTOLOG</TableHead>
                            <TableHead className="text-right sr-only">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4}>
                                <Link href="/dashboard/languages/register" className="norm-link py-2 px-1 flex items-center gap-x-2 font-medium">
                                    <PlusIcon /> <p className="tracking-wider">Add a language</p>
                                </Link>
                            </TableCell>
                        </TableRow>
                        {isError ?
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <DataError refetch={refetch} refetching={isRefetching} />
                                </TableCell>
                            </TableRow>
                            :
                            isLoading ?
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <DataLoading />
                                    </TableCell>
                                </TableRow>
                                :
                                languages?.length === 0 ?
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <NoData message="There are no languages registered yet" />
                                        </TableCell>
                                    </TableRow>
                                    :
                                    languages.map((langs) => (
                                        <TableRow key={langs?.id}>
                                            <TableCell className="font-medium">{langs?.language}</TableCell>
                                            <TableCell>{langs?.language_type}</TableCell>
                                            <TableCell>{langs?.iso_code}</TableCell>
                                            <TableCell>{langs?.glottolog_code}</TableCell>
                                            <TableCell className="text-right flex items-center justify-end gap-x-2">
                                                <Button disabled={true} className="bg-yellow-100 hover:bg-yellow-300 text-yellow-500" variant="ghost" size="icon"><Edit2Icon size={16} /></Button>
                                                <Button disabled={true} className="bg-red-100 hover:bg-red-300 text-red-500" variant="ghost" size="icon"><TrashIcon size={16} /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                    </TableBody>
                </Table>
            </div>
        </div >
    );
}

export default Languages;