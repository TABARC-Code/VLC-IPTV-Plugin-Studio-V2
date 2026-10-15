"""Check that an upgrade keeps the user's database and installs to a path with spaces."""
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class InstallerTests(unittest.TestCase):
    @unittest.skipUnless(os.name == 'posix' and os.uname().sysname in ('Linux', 'Darwin'), 'macOS/Linux installer test')
    def test_install_and_upgrade_preserve_database(self):
        with tempfile.TemporaryDirectory(prefix='iptv install ') as folder:
            data_dir = str(Path(folder) / 'VLC data café')
            def install():
                subprocess.run(['sh', str(ROOT / 'install-unix.sh'), '--data-dir', data_dir], check=True, capture_output=True)
            install()
            target = Path(data_dir) / 'lua/extensions'
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


    @unittest.skipUnless(os.name == 'posix', 'POSIX installer')
    def test_default_path_without_writing(self):
        env = dict(os.environ)
        env.pop('XDG_DATA_HOME', None)
        result = subprocess.run(['sh', str(ROOT / 'install-unix.sh'), '--dry-run'], env=env, check=True, capture_output=True, text=True)
        home = Path(os.environ['HOME'])
        if os.uname().sysname == 'Darwin':
            expected = home / 'Library/Application Support/org.videolan.vlc/lua/extensions'
        else:
            expected = home / '.local/share/vlc/lua/extensions'
        self.assertEqual(result.stdout.strip(), str(expected))

    @unittest.skipUnless(os.name == 'posix' and os.uname().sysname == 'Linux', 'Linux XDG path')
    def test_xdg_path_without_writing(self):
        with tempfile.TemporaryDirectory(prefix='iptv xdg ') as folder:
            result = subprocess.run(['sh', str(ROOT / 'install-unix.sh'), '--dry-run'],
                                    env=dict(os.environ, XDG_DATA_HOME=folder), check=True, capture_output=True, text=True)
            self.assertEqual(result.stdout.strip(), str(Path(folder) / 'vlc/lua/extensions'))

    @unittest.skipUnless(os.name == 'posix', 'POSIX installer')
    def test_launchers_from_another_directory(self):
        with tempfile.TemporaryDirectory(prefix='iptv launch ') as folder:
            for launcher in ('Install Linux.sh', 'Install macOS.command'):
                result = subprocess.run(['sh', str(ROOT / launcher), '--dry-run', '--data-dir', folder],
                                        cwd=folder, stdin=subprocess.DEVNULL, check=True, capture_output=True, text=True)
                self.assertEqual(result.stdout.strip(), str(Path(folder) / 'lua/extensions'))
                self.assertFalse((Path(folder) / 'lua').exists())

    @unittest.skipUnless(os.name == 'posix', 'POSIX installer')
    def test_bad_arguments_do_not_install(self):
        for args in (['--data-dir'], ['--data-dir', 'relative'], ['--unknown']):
            result = subprocess.run(['sh', str(ROOT / 'install-unix.sh'), *args], capture_output=True)
            self.assertNotEqual(result.returncode, 0)


if __name__ == '__main__':
    unittest.main()
