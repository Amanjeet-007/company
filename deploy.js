import { spawn } from 'child_process';
import readline from 'readline';
import path from 'path';
import fs from 'fs'; // Added for automatic file management

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function runCommand(command, args) {
    return new Promise((resolve, reject) => {
        const processStream = spawn(command, args, { 
            stdio: 'inherit', 
            shell: true 
        });

        processStream.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Command failed with code ${code}`));
        });
    });
}

// Function to handle layout security & automatic static files cloning
function handleStaticFiles() {
    try {
        const rootSitemap = path.join('sitemap.xml');
        const distDir = path.join('dist');
        const distSitemap = path.join('dist', 'sitemap.xml');

        // Check if dist directory exists, if not create it before tailwind compilation
        if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
        }

        // Automatically copy sitemap.xml to dist/ folder so servers find it directly
        if (fs.existsSync(rootSitemap)) {
            fs.copyFileSync(rootSitemap, distSitemap);
            console.log('📋 Automatically copied sitemap.xml to production build directory (dist/)');
        } else {
            console.log('⚠️ Warning: sitemap.xml not found in root directory.');
        }
    } catch (err) {
        console.error('❌ Static files sync failed:', err.message);
    }
}

async function startDeployment() {
    console.log('📦 Compiling and minifying Tailwind CSS...');
    
    try {
        const tailwindPath = path.join('node_modules', '.bin', 'tailwindcss.cmd');
        
        // Tailwind Build Execution
        await runCommand(tailwindPath, ['-i', './styles.css', '-o', './dist/output.css', '--minify']);
        console.log('✅ Tailwind CSS built successfully!');
        
        // Execute automatic copying to ensure live visibility
        handleStaticFiles();
        
        rl.question('\n💬 Enter your Git commit message: ', async (message) => {
            if (!message.trim()) {
                console.log('❌ Commit message cannot be empty. Deployment aborted.');
                rl.close();
                process.exit(1);
            }

            try {
                console.log('\n🚀 Staging files and pushing to GitHub...');
                await runCommand('git', ['add', '.']);
                await runCommand('git', ['commit', '-m', `"${message}"`]);
                await runCommand('git', ['push', 'origin', 'main']);
                
                console.log('\n✅ Successfully pushed to GitHub! Hostinger and Git Pages will update shortly.');
                console.log('🔗 Live Sitemap Check: https://axionesolution.com/sitemap.xml');
            } catch (gitError) {
                console.error('\n❌ Git deployment failed. Check your network or Git status.');
            } finally {
                rl.close();
            }
        });

    } catch (buildError) {
        console.error('❌ Build failed. Deployment aborted.');
        rl.close();
        process.exit(1);
    }
}

startDeployment();