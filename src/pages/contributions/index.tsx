import RegisterPoem from "@/components/contributions/poem/register-poem";
import RegisterSaying from "@/components/contributions/saying/register-saying";
import RegisterSentence from "@/components/contributions/sentence/register-sentence";
import RegisterWord from "@/components/contributions/word/register-word";
import Meta from "@/components/meta/meta";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContributionProvider } from "@/context/contrib-context";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

const Contributions = () => {
    const router = useRouter()
    const { tab } = router.query as ParsedUrlQuery
    const clean = tab as string
    
    return (
        <ContributionProvider>
            <div className="p-2">
                <Meta title="Contribute a word, a saying, a poem or even a sentence" />
                <div className="flex justify-center mt-5">
                    <Tabs defaultValue="word" className="w-full max-w-[650px]">
                        <TabsList className="flex flex-row flex-wrap justify-evenly items-center gap-2">
                            <TabsTrigger asChild value="word">
                                <Link href="?tab=word">Word</Link>
                            </TabsTrigger>
                            <TabsTrigger asChild value="saying">
                                <Link href="?tab=saying">Saying</Link>
                            </TabsTrigger>
                            <TabsTrigger asChild value="poem">
                                <Link href="?tab=poem">Poem</Link>
                            </TabsTrigger>
                            <TabsTrigger asChild value="sentence">
                                <Link href="?tab=sentence">Sentence</Link>
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent className="w-full bg-foreground rounded-md" value="word">
                            <RegisterWord />
                        </TabsContent>
                        <TabsContent className="w-full bg-foreground rounded-md" value="saying">
                            <RegisterSaying />
                        </TabsContent>
                        <TabsContent className="w-full bg-foreground rounded-md" value="poem">
                            <RegisterPoem />
                        </TabsContent>
                        <TabsContent className="w-full bg-foreground rounded-md" value="sentence">
                            <RegisterSentence />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </ContributionProvider>
    );
}

export default Contributions;