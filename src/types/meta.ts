export default interface MetaTypes {
    title?: string | null;
    desc?: string;
    image?: string;
    robots?: string;
    url?: string;
    tags?: string;
    type?: "Website" | "Article"
    author?: string,
    published_date?: string,
    edited_date?: string,
}