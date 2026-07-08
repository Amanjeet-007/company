import { spawn } from 'child_process';
import readline from 'readline';
import path from 'path';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper function to run terminal commands safely on Windows without breaking environment scope
function runCommand(command, args) {
    return new Promise((resolve, reject) => {
        const processStream = spawn(command, args, { 
            stdio: 'inherit', 
            shell: true // Uses the native system shell directly to bypass terminal execution restrictions
        });

        processStream.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Command failed with code ${code}`));
        });
    });
}

async function startDeployment() {
    console.log('📦 Compiling and minifying Tailwind CSS...');
    
    try {
        // Points exactly to the executable local binary script inside your project files
        const tailwindPath = path.join('node_modules', '.bin', 'tailwindcss.cmd');
        await runCommand(tailwindPath, ['-i', './style.css', '-o', './dist/output.css', '--minify']);
        console.log('✅ Tailwind CSS built successfully!');
        
        // Ask for custom user input stream safely after asset compilation finishes
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
