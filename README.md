# remix-workflows

### Remix Workflows

This is the Workflows feature of [SaasRock](https://saasrock.com), read the introduction article [here](https://saasrock.com/docs/articles/workflows).

### Demo

- Try it out (read-only): [https://remix-workflows.vercel.app](https://remix-workflows.vercel.app)
- [Watch the introduction video demo](https://www.loom.com/share/bdab996c089f471ab508a97ba2d506e2?sid=460e4675-57cf-4877-bec3-f048d8ffad7b)

### Getting Started

💿 Rename .env.example to .env and set your variables.

💿 Install dependencies:

```
npm install
```

💿 Initialize the database _(the `schema.prisma` db provider must match the `DATABASE_URL` provider)_:

```
npx prisma migrate dev --name init
```

This should apply the migrations and seed the database with sample workflows.

Or you could manually push the schema, and seed the database manually:

```
npx prisma db push
npx prisma db seed
```

💿 Start the development server:

```
npm run dev
```

💿 Build workflows 🎉!

### Features

There are 4 workflows editions:

- Open source (this project)
- [SaasRock](https://saasrock.com/pricing?ref=remix-workflows&utm_source=workflows-editions) Starter 🌱 - $149 one-time + no updates
- [SaasRock](https://saasrock.com/pricing?ref=remix-workflows&utm_source=workflows-editions) Core 🪨 - $1,399/y + updates
- [SaasRock](https://saasrock.com/pricing?ref=remix-workflows&utm_source=workflows-editions) Enterprise 🚀 - $2,099/y + updates

Full feature comparison in the following table.

| Workflow Feature | Open source | Starter 🌱 | Core 🪨 | Enterprise 🚀 |
| ---------------- | ----------- | --------- | ------- | -------------- |
| Variables | ✅ | ✅ | ✅ | ✅ |
| Credentials | ➖ | ➖ | ✅ | ✅ |
| Tenants/Accounts own workflows | ➖ | ➖ | ✅ | ✅ |
| Execution Modes |  |
| Manual | ✅ | ✅ | ✅ | ✅ |
| API | ➖ | ➖ | ✅ | ✅ |
| Stream | ➖ | ➖ | ➖ | ✅ |
| Trigger Blocks |  |
| Manual | ✅ | ✅ | ✅ | ✅ |
| Row Event | ➖ | ➖ | ➖ | ✅ |
| Action Blocks |  |
| IF | ✅ | ✅ | ✅ | ✅ |
| HTTP Request | ✅ | ✅ | ✅ | ✅ |
| Log | ✅ | ✅ | ✅ | ✅ |
| Alert User | ✅ | ✅ | ✅ | ✅ |
| Switch | ➖ | ✅ | ✅ | ✅ |
| Iterator | ➖ | ✅ | ✅ | ✅ |
| Variable | ➖ | ✅ | ✅ | ✅ |
| Wait for Input | ➖ | ➖ | ➖ | ✅ |
| GPT Chat Completion | ➖ | ➖ | ➖ | ✅ |
| Row Get, Create, Update, Delete | ➖ | ➖ | ➖ | ✅ |
| Cron Blocks (Sleep, Delay until...) | ➖ | ➖ | ➖ | 🚧 |
| Send Email | ➖ | ➖ | ➖ | 🚧 |
| Global workflows | ➖ | ➖ | ➖ | 🚧 |

### Community

- Join the [Discord](https://discord.gg/KMkjU2BFn9).
- Follow [SaasRock](https://twitter.com/saas_rock) or [me](https://twitter.com/AlexandroMtzG) on Twitter.

### License

Licensed under the MIT License.

### Other Open Source Projects

- [Remix Page Blocks](https://github.com/AlexandroMtzG/remix-page-blocks): Simple page block editor with Remix and Tailwind CSS.
- [Remix Blocks](https://github.com/AlexandroMtzG/remix-blocks): Ready-to-use Remix + Tailwind CSS routes and components.
- [SaasRock Knowledge Base](https://github.com/alexandroMtzG/saasrock-kb): Knowledge Base starter kit with WYSIWYG, Markdown, GPT, and Multi-language support.
- [Novel Remix](https://github.com/AlexandroMtzG/novel-remix): Remix Edition - Notion-style WYSIWYG editor with AI-powered autocompletion.

### Sponsor

If you find **Remix Workflows** useful and would like to support its development, consider becoming a sponsor. Your sponsorship will help ensure the continued maintenance and improvement of this project.

You can sponsor me on [GitHub Sponsors](https://github.com/sponsors/AlexandroMtzG). Every contribution is highly appreciated!
