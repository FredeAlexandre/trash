# Minecraft - @cod/minecraft

This package contains the Minecraft Schematics files for the game projet assets. This repository make the bridge between Minecraft construction and the version control system.

## Getting Started

1. Download Minecraft

I recommend you to download TLauncher because there is no need to access your Minecraft account and the installtion of mods is easier.

- [TLauncher](https://tlauncher.org/en/)

> Attention si vous installer TLauncher a pas installer des logiciels tier comme 360 Total Security.

2. Install mods

Version:

- Minecraft 1.20.2
- Fabric 0.15.7

You need to install this mods:

- [Litematica](https://www.curseforge.com/minecraft/mc-mods/litematica)
- [Malilib](https://www.curseforge.com/minecraft/mc-mods/malilib)
- [Isometric Renders](https://www.curseforge.com/minecraft/mc-mods/isometric-renders)
- [owo lib](https://www.curseforge.com/minecraft/mc-mods/owo-lib)
- [WorldEdit](https://www.curseforge.com/minecraft/mc-mods/worldedit)

Here is a video to be sure do this the right way:

https://github.com/FredeAlexandre/clash-of-discord/assets/114904483/f97eef76-3b21-4fc2-99df-5446dffd4bee

## Tutorials

### Void World

A void world is a world with no blocks. This is useful to create a schematic in a clean world.

1. Create a new world
2. Set Game Mode to Creative and hit "World"
3. Set

- Generate Structures: OFF
- Bonus Chest: OFF
- World Type: Superflat

4. Customize the superflat settings
5. Click to the void preset or copy paste this

```text
minecraft:air;minecraft:the_void
```

6. Create you world
7. Usefull commands

- `/gamerule doDaylightCycle false` - Prevent the day/night cycle
- `/time set 6000` - Put the sun at the very top
- `/setblock ~ ~ ~ minecraft:stone` - Set a block at the current position
