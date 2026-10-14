"""Check that an upgrade keeps the user's database and installs to a path with spaces."""
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class InstallerTests(unittest.TestCase):
    @unittest.skipUnless(os.name == 'posix' and os.uname().sysname != 'Darwin', 'Linux installer test')
    def test_install_and_upgrade_preserve_database(self):
        with tempfile.TemporaryDirectory(prefix='iptv install ') as folder:
            env = dict(os.environ, XDG_DATA_HOME=folder)
            def install():
                subprocess.run(['sh', str(ROOT / 'install-unix.sh')], env=env, check=True, capture_output=True)
            install()
            target = Path(folder) / 'vlc/lua/extensions'
            csv = target / 'iptv-channel-player-assets/channels.csv'
            csv.write_text('my private maintained database')
            script = target / 'iptv-channel-player.lua'
            script.write_text('old extension')
            install()
            self.assertEqual(csv.read_text(), 'my private maintained database')
            self.assertEqual(script.read_bytes(), (ROOT / 'iptv-channel-player.lua').read_bytes())
            backups = list(target.glob('iptv-channel-player.lua.backup-*'))
            self.assertEqual(len(backups), 1)
            self.assertEqual(backups[0].read_text(), 'old extension')
            self.assertTrue((target / 'iptv-channel-player-assets/brand.png').is_file())
            self.assertTrue((target / 'iptv-channel-player-assets/README.md').is_file())


if __name__ == '__main__':
    unittest.main()
