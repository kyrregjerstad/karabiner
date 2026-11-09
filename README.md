# based on the fantastic @mxstbr's Karabiner Elements configuration

If you like TypeScript and want your Karabiner configuration maintainable & type-safe, you probably want to use the
custom configuration DSL / generator I created in `rules.ts` and `utils.ts`!

modified to use bun instead of yarn and customized for my own use

## Installation

1. Install & start [Karabiner Elements](https://karabiner-elements.pqrs.org/)
2. Clone this repository

```bash
gh repo clone kyrregjerstad/karabiner
```

3. cd into the repository

```bash
cd karabiner
```

4. Delete the default `~/.config/karabiner` folder

```bash
rm -rf ~/.config/karabiner
```

1. While still cd in the project root, create a symlink to the `karabiner.json` file

```bash
ln -s "$(pwd)/karabiner.json" ~/.config/karabiner/karabiner.json
```

5. [Restart karabiner_console_user_server](https://karabiner-elements.pqrs.org/docs/manual/misc/configuration-file-path/)

```bash
launchctl kickstart -k gui/`id -u`/org.pqrs.karabiner.karabiner_console_user_server
```

## Development

```bash
bun install
```

```bash
bun run build
```

builds the `karabiner.json` from the `index.ts`.

```bash
bun run watch
```

watches the TypeScript files and rebuilds whenever they change.

## Tinycast

The existing Caps Lock Hyper layer uses Tinycast. Hold Caps Lock + R, then
press A for AI Chat, B for Bluetooth, C for camera, E for emoji, H for clipboard
history, N to dismiss notifications, or T for system appearance. Keys 1 and 2
run Toothpick's favorite-device commands, which require Toothpick installed and
its favorites configured in Tinycast. Confetti has no equivalent and is unbound.
Caps Lock + [ / ] / Enter runs left half / right half / maximize.

Tinycast 0.12.1 supports extension URLs, but native commands require hotkeys.
`tinycast.ts` defines the shortcuts emitted by Karabiner. Run `bun run tinycast.ts`
once to register missing bindings in Tinycast, then restart Tinycast and run
`bun run build`. Setup preserves matching bindings and refuses conflicting ones.
Clipboard uses Option+V; the other native commands use Control+Option+Shift+Command
with their corresponding key. Keep Tinycast running with the relevant features
and macOS permissions enabled. AI Chat also requires Tinycast's AI setup.
