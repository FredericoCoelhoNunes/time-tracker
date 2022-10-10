/* eslint-disable */
import { Pane } from 'tweakpane';

function createPreferencesPane() {
    /* Creates the pane with the different preference options.
       TODO: DRY this up (one subfunction for each folder in the panel i.e.: each storage type)
    */
    const pane = new Pane({
        container: document.getElementById('container'),
        title: "Preferences"
    });

    // controls displaying the right properties 
    const TOP_LEVEL_PARAMS = {
        'storage_type': '',
    }

    const storageType = pane.addInput(TOP_LEVEL_PARAMS, 'storage_type', {
        options: {
            none: '',
            'Filesystem Storage': 'fs_storage',
            'S3 Storage': 's3_storage',
        },
        label: "Storage Type"
    });

    // FS Storage options
    pane.addSeparator();
    const FS_STORAGE_PARAMS = {
        'storage_location': '',
    }

    const fs_storage_options_folder = pane.addFolder({
        title: 'Filesystem Storage',
        expanded: true,
    });
    fs_storage_options_folder.disabled = true;

    const storage_location = fs_storage_options_folder.addInput(FS_STORAGE_PARAMS, 'storage_location', { label: "Storage Folder"});

    const select_folder_btn = fs_storage_options_folder.addButton({
        title: 'Select Folder',
    });
      
    select_folder_btn.on('click', () => {
        const dialogConfig = {
            title: 'Select a folder',
            buttonLabel: 'Select Folder',
            properties: ['openDirectory']
        };
        window.electronAPI.selectFile(
            'showOpenDialog', dialogConfig
        ).then(result => {
            storage_location.controller_.binding.value.rawValue = result.filePaths[0];
        });
    });

    // Cloud storage options
    pane.addSeparator();
    const S3_STORAGE_PARAMS = {
        'bucket_location': '',
    }

    const s3_storage_options_folder = pane.addFolder({
        title: 'S3 Storage',
        expanded: true,
    });
    s3_storage_options_folder.disabled = true;

    s3_storage_options_folder.addInput(S3_STORAGE_PARAMS, 'bucket_location', { label: "Bucket Location"});

    // Button to save results
    pane.addSeparator();
    const save_prefs_button = pane.addButton({
        title: 'Save Preferences',
    });
      
    save_prefs_button.on('click', () => {
        // Sending a message to the main process, to store the preferences, and closes the window
        const prefs = pane.exportPreset();
        console.log(prefs);
        window.electronAPI.savePrefs(prefs);
        window.close()
    });

    // All panes + event handler to disable panes according to changes on the storageType top level option
    const allPanes = {
        'fs_storage': fs_storage_options_folder,
        's3_storage': s3_storage_options_folder
    }
    storageType.on('change', (ev) => {
        for (const [key, pane_folder] of Object.entries(allPanes)) {
            if (key == ev.value) {
                pane_folder.disabled = false;
            } else {
                pane_folder.disabled = true;
            }
        };
    })

    return pane;
}

const pane = createPreferencesPane();