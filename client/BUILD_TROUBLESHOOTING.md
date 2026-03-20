# Build troubleshooting

## "EIO: i/o error, read" when running `npm run build`

This error usually comes from the filesystem or environment, not from application code.

### Try these steps (in order)

1. **Use the no-sourcemaps build script**
   ```bash
   npm run build:no-sourcemaps
   ```

2. **Clear cache and rebuild**
   ```bash
   rm -rf node_modules/.cache build
   npm run build
   ```

3. **Reinstall dependencies**
   ```bash
   rm -rf node_modules
   npm install
   npm run build
   ```

4. **Ensure `.env` is loaded**  
   The file `client/.env` should contain:
   ```
   GENERATE_SOURCEMAP=false
   ```
   So that source-map handling is disabled during the build.

5. **If the error continues**  
   It may be environmental (disk, network drive, antivirus, or WSL):
   - Run the build from a different folder (e.g. copy the project to another drive).
   - Try another package manager: `yarn install` then `yarn build`.
   - Restart the machine (helps with WSL2 or virtual disks).
   - Run the **dev server** instead: `npm start` — if that works, the app code is fine and the issue is specific to the production build on this machine.

## Module resolution ("Can't resolve ... caritasProjects")

Project and partner data lives in **`src/lib/caritasProjects.ts`**. Imports should use:

- From `src/pages/*` or `src/components/*`:  
  `import { ... } from '../lib/caritasProjects';`

Do not import from `../caritasProjects` or `../data` for this data; use `../lib/caritasProjects`.
