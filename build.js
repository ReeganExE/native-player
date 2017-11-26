const path = require('path');
const spawn = require('child_process').spawn;
const pack = require('./package.json');

const dist = determinateOutput();

doBuild(dist);

function determinateOutput() {
  const os = process.env.GOOS || 'windows';
  const name = pack.name + (os === 'windows' ? '-win32.exe' : `-${os}`);
  return path.resolve('./dist', name);
}

function doBuild(dist) {
  const args = ['build', '-ldflags', '"-s -w"', '-o', dist];
  const buildProc = spawn('go', args, { cwd: path.resolve('./src/native'), shell: true });
  buildProc.stdout.on('data', (data) => {
    console.log(`[Build]: ${data}`);
  });
  buildProc.stderr.on('data', (data) => {
    console.error(`[Build-ERROR]: ${data}`);
  });
  buildProc.on('close', (code) => {
    console.log(`Build process exited with code ${code}`);
  });
}
