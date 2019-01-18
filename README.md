# Let's Build Some Mechs!

## Requirements

If you want to start poking around with this converter, you'll need a couple things.

- Git.
- A current version of NodeJS.
- A text editor ( I like [**VSCode**](https://code.visualstudio.com/) ).

## Installation

Make sure you've got Git installed by running `$ git --version` in your terminal. If you don't, [**here**](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) are some instructions. Once you've verified your git installation, go ahead and clone this repository by running:

```bash
$ git clone https://github.com/humanpersonbiz/megamek-to-alpha-strike.git [target_directory]
```

There are a bunch of recommended ways to install Node, so I won't try and tell you what's best. I've always been happy using the default install instructions, which you can find [**here**](https://nodejs.org/en/).

Node comes with a pretty good package manager ( [**npm**](https://www.npmjs.com/get-npm) ), but I prefer **yarn**. It's faster, which is better ( right? ). If you want to add a step and save a little time whenever you add a package, [**here**](https://yarnpkg.com/lang/en/docs/install/) are some installation instructions.

After that's all done, you just need to install your package dependencies by running the following command:

```bash
# using npm
$ npm install

# yarn
$ yarn
```

## Running

This project uses Typescript, which lets nerds statically type their Javascript ( for safety ! ). Good news, your editor can warn you before you start assigning values all willy-nilly. Bad news, it adds some complexity.

To run the app and start processing some mechs, just run `$ yarn dev` in the project directory. It'll read all the `.mtf` files in `./inFiles`, turn them into `.json` and drop them into `./outFiles`. Cool!
