import Meta from "@/components/meta/meta";
import { useInfiniteQuery } from "@tanstack/react-query";

const Donate = () => {
    const { data, isLoading, isError } = useInfiniteQuery({})

    return (
        <>
            <Meta title="Donate to betenda or to a campaign" />
            <div className="px-1">
                <div className="flex flex-col items-center mt-4">
                    <section id="donations" className="bg-foreground rounded-md w-full my-3 border p-4 space-y-8">
                        <div>
                            <h1 className="text-4xl font-extrabold">Donations</h1>
                            <h1 className="text-xl font-medium opacity-60">We appreciate every single donation!, thank you so much</h1>
                        </div>
                        <div className="dns-grid gap-5">
                            <div className="rounded-md bg-background h-48 w-full border">
                            </div>
                            <div className="rounded-md bg-background h-48 w-full border">
                            </div>
                            <div className="rounded-md bg-background h-48 w-full border">
                            </div>
                            <div className="rounded-md bg-background h-48 w-full border">
                            </div>
                        </div>
                    </section>
                    <section id="donate_to_betenda" className="max-w-[900px] bg-foreground rounded-md w-full my-3 border p-4 space-y-8">
                        <h1 className="text-6xl font-extrabold opacity-80">Donate to keep us online</h1>
                        <p className="mt-4 text-xl font-medium">Servers are expensive and are necessary to keep <strong>Betenda</strong> live, contribute what you can to keep this community afloat</p>
                    </section>
                    <section id="donate_to_a_campaign" className="bg-foreground rounded-md w-full my-3 border p-4 space-y-8">
                        <h1 className="text-4xl font-extrabold opacity-80">Donate to a campaign</h1>
                        <div>

                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

export default Donate;