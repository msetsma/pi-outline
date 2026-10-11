# Regenerate with `vhs demo/demo.tape` from the repo root.
# Needs the fork checked out at ../pi-my. Runs offline with a fake model.
Output demo/demo.gif

Set Shell bash
Set FontSize 15
Set Width 1200
Set Height 640
Set Padding 16
Set Theme "Catppuccin Mocha"
Set TypingSpeed 60ms
Set Framerate 20

Hide
Type `export PI=$PWD/../pi-my/pi-test.sh REPO=$PWD PI_CODING_AGENT_DIR=$(mktemp -d) PI_SKIP_VERSION_CHECK=1 PI_TUI_ESC_TIMEOUT=300 PS1='$ '` Enter
Type `printf '{"defaultProvider":"demo","defaultModel":"demo-model","defaultThinkingLevel":"off","packages":["%s"],"extensions":["%s/demo/faux.ts"],"tuiMode":"fullscreen","quietStartup":"header","theme":"dark","lastChangelogVersion":"99.0.0"}' "$REPO" "$REPO" > $PI_CODING_AGENT_DIR/settings.json` Enter
Type "mkdir -p /tmp/my-project && cd /tmp/my-project && clear && $PI --no-env" Enter
Sleep 10s
Show

Type "add a health check endpoint" Sleep 300ms Enter Sleep 1.5s
Type "write tests for it" Sleep 300ms Enter Sleep 1.5s
Type "rename the handler to getStatus" Sleep 300ms Enter Sleep 2s

# vhs Alt+key does not send ESC+key on macOS, so send the bytes by hand.
Escape Type@1ms "o" Sleep 2.5s

Type "include uptime and version in the response" Sleep 300ms Enter Sleep 3s

Type "/outline" Sleep 400ms Enter Sleep 1.5s
Type "/outline" Sleep 400ms Enter Sleep 3s
