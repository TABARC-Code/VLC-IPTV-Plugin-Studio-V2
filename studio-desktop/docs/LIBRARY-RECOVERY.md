# Library backups and recovery

I keep a copy of the previous saved library whenever Studio replaces a different version of its contents. Up to five previous versions are kept per library; older backups are removed as new ones are made.

## Recover a previous version

Open the library in Studio and choose **Recover**. Pick the version you need, confirm the replacement, and Studio restores those channels. The library being replaced is saved as another backup first, so recovery itself can be reversed.

If you've made changes that haven't been saved, use **Save as** to keep them in a separate library before restoring anything.

## When a save is refused

Studio compares the file on disk with the version it originally opened. If another programme has changed the file since then, Studio refuses the save rather than overwriting the newer copy. Use **Save as** to preserve your current edits, then inspect or reload the changed library.

New CSV and M3U imports also get new filenames when a matching library already exists. The original import file is left untouched.

## Where the files live

Libraries are in Studio's managed `libraries` directory. Previous copies are held in its private `.backups` subdirectory, with the original library filename included in each backup name. The **Open library folder** button takes you to the parent directory.

These backups are local, not cloud storage. The five-version limit only applies to copies created by Studio. Keep your own off-device backups if losing the library would cause problems.

**Keep backup files private.** Channel URLs can contain provider tokens or credentials. Recovery copies are created with restricted file permissions where the operating system supports them; copying the folder elsewhere may change those protections.

Studio checks for file changes before replacement, but an external process that writes to the same file at the exact moment of the final rename can still cause a race. Avoid simultaneous editors against the same library.
