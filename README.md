# @kampus/monorepo

kamp.us web projects & packages

## Before starting

- The languages we use in this repo:
  - Typescript
    - [remix.run](https://remix.run) - a react web application framework
  - Golang
    - [Twirp](https://github.com/twitchtv/twirp)
- Join our discord at https://discord.kamp.us
- We use `#kampus-projects` channel for onboarding people to the project.
- Talk to us so we can figure out a plan together what would be the best way
  for you to contribute to the project.
- For any questions use this channel so we can help you.

## How to start

- Fork `kamp-us/monorepo` under your personal account.
  - eg: `usirin/monorepo`
- Clone the project to your local computer:

```
git clone git@github.com:kamp-us/monorepo.git
cd monorepo
```

## Structure

```
.
├── README.md
├── apps
│   └── pano
├── package-lock.json
├── package.json
├── packages
│   ├── kampus-eslint-config
│   ├── kampus-jest-presets
│   ├── kampus-tsconfig
│   └── kampus-ui
└── turbo.json
```

- `/apps`: services & apps
- `/packages`: internal (and maybe external in the future) npm packages

These folders are [registered as workspaces in package.json](package.json#L4-L7)

## Running the projects

### Setup projects

Install dependencies and build all projects.

```
npm install
npx turbo build
```

## Documentation for each app & package

### Apps

- [pano](./apps/pano/README.md)

### Packages

- [kampus-ui](./packages/kampus-ui/README.md)
