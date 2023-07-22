import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/user-context";

const Profile = () => {
    const { User } = useUserContext()
    return (
        <div className="px-2">
            <div className="max-w-[700px] border rounded-md my-2">
                <h2 className="text-2xl font-extrabold p-2">Account details</h2>
                <div className="flex flex-col gap-y-1 px-2">
                    <div className="flex items-center justify-between p-2">
                        <p className="font-medium opacity-70">Full name</p>
                        <p className="font-medium">{`${User?.first_name} ${User?.last_name}`}</p>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between p-2">
                        <p className="font-medium opacity-70">User name</p>
                        <p className="font-medium">{`@${User?.user_name}`}</p>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between p-2">
                        <p className="font-medium opacity-70">Full name</p>
                        <p className="font-medium">{`${User?.first_name} ${User?.last_name}`}</p>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between p-2">
                        <p className="font-medium opacity-70">Full name</p>
                        <p className="font-medium">{`${User?.first_name} ${User?.last_name}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;