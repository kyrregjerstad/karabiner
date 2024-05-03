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
