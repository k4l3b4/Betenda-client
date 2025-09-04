import FeedLayout from "@/components/layout/feed-layout";
import Meta from "@/components/meta/meta";
import Notifications from "@/components/notifications/notifications";

const NotificationsPage = () => {
    return (
        <FeedLayout>
            <Meta title="Notifications" />
            <Notifications />
        </FeedLayout>
    );
}

export default NotificationsPage;