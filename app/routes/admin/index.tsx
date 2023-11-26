import { marked } from "marked";

export default function () {
  return (
    <div className="prose mx-auto max-w-7xl px-12">
      <div
        dangerouslySetInnerHTML={{
          __html: marked(content),
        }}
      />
    </div>
  );
}

let content = `## Remix Workflows

This is the Workflows feature of [SaasRock](https://saasrock.com/?ref=remix-workflows&utm_source=readme), read the introduction article [here](https://saasrock.com/docs/articles/workflows?ref=remix-workflows&utm_source=readme).

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
`;
