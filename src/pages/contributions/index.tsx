import RegisterPoem from "@/components/contributions/poem/register-poem";
import RegisterSaying from "@/components/contributions/saying/register-saying";
import RegisterSentence from "@/components/contributions/sentence/register-sentence";
import RegisterWord from "@/components/contributions/word/register-word";
import Meta from "@/components/meta/meta";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContributionProvider } from "@/context/contrib-context";

const Contributions = () => {    
    return (
        <ContributionProvider>
            <div className="p-2">
                <Meta title="Contribute a word, a saying, a poem or even a sentence" />
                <div className="flex justify-center items-start mt-5">
                    <Tabs defaultValue="word" className="w-full max-w-[650px]">
                        <TabsList className="flex flex-row flex-wrap justify-evenly items-center gap-2">
                            <TabsTrigger asChild value="word">
                                Word
                            </TabsTrigger>
                            <TabsTrigger asChild value="saying">
                                Saying
                            </TabsTrigger>
                            <TabsTrigger asChild value="poem">
                                Poem
                            </TabsTrigger>
                            <TabsTrigger asChild value="sentence">
                                Sentence
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