This is a [Next.js](https://nextjs.org/) project bootstrapped with [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Betenda client

This repository contains the frontend TypeScript Next.js app that serves as a client for the [Betenda](https://github.com/k4l3b4/Betenda) word and language contribution backend API. The app allows users to contribute new words, translations, and language-related data to the backend API as well as handling user communications and social media like functionalities, fostering collaboration and enrichment of linguistic resources.

## Features
- **User Authentication**: Users can sign up, log in, and manage their accounts to contribute words and translations securely.
- **User feed**: Users can access their feed, post posts, reply to posts, comment on other people contributions and articles, react to contributions, articles, comments and posts.
- **Social featured**: handles features like following, requesting to follow, accepting follow requests and much more!
- **Contribution Form**: The app provides an intuitive form for users to submit new words, translations, and related information.
- **Search and Filter**: Users can search for existing contributions and apply filters based on language, word type, or region.
- **Contributor Dashboard**: Contributors can access a personalized dashboard to view their contributions, edit existing data, and track their activity.
- **User profile**: users can access their profile and also update it to their needs, profile pictures, cover photos changin account to private.
  and much more that i have not included in this list

## Technologies Used

- Frontend: TypeScript, Next.js, React, Tailwind CSS, Scss, [tiptap(WYSIWYG editor)](https://github.com/ueberdosis/tiptap), [react-query](https://github.com/TanStack/query), [shadcn ui](https://github.com/shadcn-ui/ui)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/k4l3b4/Betenda-client.git
cd Betenda-client
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

Copy the `.env.example` file and rename it to `.env`. Update the environment variables with your backend API URL and any necessary authentication details.

4. Start the development server:

```bash
npm run dev
```

The app should now be running on `http://localhost:3000`.

## Contributing

We welcome contributions to improve and enhance the app. If you find any bugs or have ideas for new features, please open an issue or submit a pull request.

Before making any contributions, please read our [contribution guidelines](CONTRIBUTIONS.md).

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

If you have any questions or need further assistance, feel free to contact me on my telegram account @kaleb_abebe.

Happy contributing! 🚀

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/)

## Deploy on Vercel
You can deploy this frontend app on [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out their [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
