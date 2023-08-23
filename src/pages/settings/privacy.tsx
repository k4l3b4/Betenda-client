import SettingsLayout from "@/components/layout/settings-layout";
import Meta from "@/components/meta/meta";
import { Label } from "@/components/ui/label";
import { useUserContext } from "@/context/user-context";
import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";

const Privacy = () => {
    const { User } = useUserContext()
    const [enabled, setEnabled] = useState<boolean>(false)

    useEffect(() => {
        setEnabled(User?.is_private)
    }, [User])

    return (
        <SettingsLayout>
            <Meta title="Privacy settings" />
            <div className="flex items-center justify-between space-x-2 p-4">
                <Label htmlFor="private_account"><h3>Private account</h3></Label>
                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className={`${enabled ? 'bg-black dark:bg-white' : 'bg-background'}
          relative inline-flex h-[30px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                >
                    <span className="sr-only">Make account private</span>
                    <span
                        aria-hidden="true"
                        className={`${enabled ? 'translate-x-[30px] bg-white' : 'translate-x-0 bg-foreground'}
            pointer-events-none inline-block h-[26px] w-[26px] transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                </Switch>
            </div>
        </SettingsLayout>
    );
}

export default Privacy;