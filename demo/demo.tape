# Regenerate with `vhs demo/demo.tape` (or `demo-gif demo/demo.tape`) from the repo root.
# Needs: vhs and the pi-my fork at ../pi-my. Runs offline with a fake model (demo/faux.ts).
Output demo/demo.gif

Set Shell bash
Set FontSize 22
Set Width 1200
Set Height 680
Set Padding 16
Set Theme "Catppuccin Mocha"
Set TypingSpeed 60ms
Set Framerate 20

# Hidden setup: a throwaway HOME keeps real config and paths out of the
# recording. pwd -P matters on macOS, where temp dirs resolve under /private.
Hide
Type@1ms `REPO="$PWD"; PI="$PWD/../pi-my/pi-test.sh"; export HOME="$(cd "$(mktemp -d)" && pwd -P)" PS1='$ '; mkdir -p ~/.pi/agent ~/my-project && cd ~/my-project`
Enter
Type@1ms `printf '{"defaultProvider":"demo","defaultModel":"demo-model","defaultThinkingLevel":"off","packages":["%s"],"extensions":["%s/demo/faux.ts"],"tuiMode":"fullscreen","quietStartup":"header","theme":"dark","lastChangelogVersion":"99.0.0"}' "$REPO" "$REPO" > ~/.pi/agent/settings.json && clear`
Enter
Type@1ms `PI_CODING_AGENT_DIR=~/.pi/agent PI_SKIP_VERSION_CHECK=1 PI_TUI_ESC_TIMEOUT=300 "$PI" --no-env`
Enter
Wait+Screen@30s /commands/
# History for the outline, so the panel opens on a real session.
Type@1ms "add a health check endpoint" Enter
Wait+Screen@15s /status: "ok"/
Type@1ms "write tests for it" Enter
Wait+Screen@15s /JSON body/
Type@1ms "rename the handler to getStatus" Enter
Wait+Screen@15s /and the tests/
Sleep 300ms
Show

# alt+o opens the outline. vhs Alt+key does not send ESC+key on macOS, so send the bytes by hand.
Sleep 500ms
Escape Type@1ms "o"
Sleep 2.5s

# A new prompt lands at the bottom of the list.
Type "include uptime and version in the response"
Sleep 400ms
Enter
Sleep 3s

# /outline toggles it too.
Type "/outline"
Sleep 400ms
Enter
Sleep 1.5s
Type "/outline"
Sleep 400ms
Enter
Sleep 2.5s
