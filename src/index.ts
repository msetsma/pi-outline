import type { ExtensionAPI, ExtensionContext, MessageEndEvent, Theme } from "@earendil-works/pi-coding-agent";
import { type Component, ScrollView, type TUI, truncateToWidth } from "@earendil-works/pi-tui";

const STATE = "pi-outline.state";
const WIDGET = "pi-outline";

/** First line of a user prompt, for the outline panel. */
function promptTitle(message: MessageEndEvent["message"]): string | undefined {
	if (message.role !== "user") return undefined;
	const { content } = message;
	const text = typeof content === "string" ? content : content.map((p) => (p.type === "text" ? p.text : "")).join(" ");
	return text.trim().split("\n")[0];
}

export default function piOutline(pi: ExtensionAPI) {
	// Captured from the panel factory; setWidget calls it immediately.
	let tui: TUI | undefined;
	const rerender = () => tui?.requestRender();

	// Content state lives here, not in the component, because hiding the panel
	// disposes its component.
	const outline: string[] = [];
	const refreshOutline = (ctx: ExtensionContext) => {
		outline.length = 0;
		for (const entry of ctx.sessionManager.getBranch()) {
			const title = entry.type === "message" ? promptTitle(entry.message) : undefined;
			if (title !== undefined) outline.push(title);
		}
		rerender();
	};
	const factory = (t: TUI, theme: Theme): Component => {
		tui = t;
		const bar = theme.fg("dim", "│ ");
		const body: Component = {
			render: (width) =>
				[
					theme.fg("accent", "Outline"),
					...(outline.length === 0
						? [theme.fg("dim", "no prompts yet")]
						: outline.map((title, i) => `${theme.fg("dim", `${i + 1}.`)} ${title}`)),
				].map((text) => bar + truncateToWidth(text, width - 2)),
			invalidate() {},
		};
		return new ScrollView(body, { overscroll: "contain", follow: "end" });
	};

	let shown = false;
	const apply = (ctx: ExtensionContext) =>
		ctx.ui.setWidget(WIDGET, shown ? factory : undefined, { placement: "right", width: 32 });
	const toggle = (ctx: ExtensionContext) => {
		shown = !shown;
		apply(ctx);
		// Showing runs the factory, so tui is known here even on the first toggle.
		if (tui?.mode !== "fullscreen") {
			shown = false;
			apply(ctx);
			ctx.ui.notify('The outline panel needs fullscreen mode ("tuiMode": "fullscreen")', "warning");
			return;
		}
		// Stored in the session so /reload (and resume) restore it.
		pi.appendEntry(STATE, { shown });
	};

	pi.registerCommand("outline", {
		description: "Toggle the outline side panel (fullscreen only)",
		handler: async (_args, ctx) => toggle(ctx),
	});
	pi.registerShortcut("alt+o", {
		id: "pi-outline.toggle",
		description: "Toggle outline panel",
		handler: (ctx) => toggle(ctx),
	});

	pi.on("session_start", (_event, ctx) => {
		if (ctx.mode !== "tui") return;
		refreshOutline(ctx);
		shown = false;
		for (const entry of ctx.sessionManager.getEntries()) {
			if (entry.type === "custom" && entry.customType === STATE) {
				shown = (entry.data as { shown?: boolean } | undefined)?.shown === true;
			}
		}
		apply(ctx);
	});

	// message_end reaches extensions before the message is saved, so the branch
	// doesn't have it yet; append from the event instead of re-reading.
	pi.on("message_end", (event) => {
		const title = promptTitle(event.message);
		if (title !== undefined) outline.push(title);
		rerender();
	});
	pi.on("session_tree", (_event, ctx) => refreshOutline(ctx));
	pi.on("session_shutdown", () => {
		tui = undefined;
	});
}
