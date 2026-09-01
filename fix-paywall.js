const fs = require('fs');
const path = require('path');

const base = 'src/app/dashboard';

function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name === 'page.tsx') {
      let content = fs.readFileSync(full, 'utf8');
      // Fix the corrupted attribute: <PaywallGate requiredRole=" admin>
      // Restore to: <PaywallGate requiredRole="admin">
      const bad1 = '<PaywallGate requiredRole=" admin>';
      const bad2 = "<PaywallGate requiredRole=' admin>";
      const good = '<PaywallGate requiredRole="admin">';
      if (content.includes(bad1) || content.includes(bad2)) {
        content = content.split(bad1).join(good).split(bad2).join(good);
        fs.writeFileSync(full, content, 'utf8');
        console.log('Fixed:', full);
      } else {
        console.log('Already OK:', full);
      }
    }
  });
}

walk(base);
