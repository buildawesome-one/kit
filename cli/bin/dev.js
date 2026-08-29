#!/usr/bin/env node

import { execSync } from "node:child_process";
import { setDefaultCACertificates } from "node:tls";

execSync("npm link @buildawesome.one/cli @buildawesome.one/config @buildawesome.one/plugin @anyblades/blades", {
  stdio: "inherit",
});

/* Usage:
```sh
npx node_modules/@buildawesome.one/cli
```*/
