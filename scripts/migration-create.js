const { execSync } = require('child_process');

const name = process.argv[2];
if (!name) {
    console.error('Migration name required!');
    process.exit(1);
}
execSync(`npm run typeorm migration:generate -- src/migrations/${name} -d src/app/data-source.ts`, {
    stdio: 'inherit',
});
