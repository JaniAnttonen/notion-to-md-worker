import { Client } from "@notionhq/client";
import { Router } from "itty-router";
import { NotionToMarkdown } from "notion-to-md";

const router = Router();

router.get('/', async (_request, env) => {
	const notion = new Client({
		auth: env.NOTION_TOKEN,
	})

	const db = await notion.databases.query({
		database_id: env.DATABASE_ID,
	})
  return new Response(JSON.stringify(db))
});

router.get('/:id', async ({ params }, env) => {
	const notion = new Client({
		auth: env.NOTION_TOKEN,
	})

	const n2m = new NotionToMarkdown({ notionClient: notion });
	const blocks = await n2m.pageToMarkdown(params.id);
  const page = n2m.toMarkdownString(blocks);
	return new Response(JSON.stringify(page));
});

export default {
	fetch: router.handle,
};
