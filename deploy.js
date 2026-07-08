import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('📦 Compiling and minifying Tailwind CSS...');
try {
    // Windows के मुख्य cmd शेल का उपयोग करके लोकल बिन को सीधे टारगेट किया गया है
    execSync('cmd /c "node_modules\\.bin\\tailwindcss -i ./style.css -o ./dist/output.css --minify"', { stdio: 'inherit' });
    console.log('✅ Tailwind CSS built successfully!');
} catch (error) {
    console.error('❌ Build failed. Deployment aborted.');
    process.exit(1);
}

rl.question('\n💬 Enter your Git commit message: ', (message) => {
    if (!message.trim()) {
        console.log('❌ Commit message cannot be empty. Deployment aborted.');
        rl.close();
        process.exit(1);
    }

    try {
        console.log('\n🚀 Staging files and pushing to GitHub...');
        
        execSync('git add .', { stdio: 'inherit' });
        execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
        execSync('git push origin main', { stdio: 'inherit' });
        
        console.log('\n✅ Successfully pushed to GitHub! Hostinger and Git Pages will update shortly.');
    } catch (error) {
        console.error('\n❌ Git deployment failed. Check your network or Git status.');
    }

    rl.close();
});
