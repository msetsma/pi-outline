import { fauxAssistantMessage, fauxProvider } from "@earendil-works/pi-ai";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

// Offline model for the demo recording: canned replies, no network.
const replies = [
	"Added GET /health in src/server.ts. It returns 200 with { status: \"ok\" }.",
	"Wrote tests/health.test.ts: one test for the 200 status, one for the JSON body.",
	"Renamed healthHandler to getStatus and updated the route and the tests.",
	"Added uptime and version fields to the response. Tests updated.",
	"Done.",
];

export default function (pi: ExtensionAPI) {
	const faux = fauxProvider({
		provider: "demo",
		models: [{ id: "demo-model", name: "Demo Model", contextWindow: 200_000, reasoning: true }],
		tokensPerSecond: 400,
	});
	faux.setResponses(Array.from({ length: 50 }, (_, i) => () => fauxAssistantMessage(replies[Math.min(i, replies.length - 1)])));
	pi.registerProvider(faux.provider);
}
